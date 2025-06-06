
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import AdminNav from '@/components/adminNav.vue'

const form = ref({
  empName: '',
  department: '',
  experience: 0,
  address: '',
  birthdate: '',
  employePhoto: ''
})

const loading = ref(false)
const message = ref('')
const success = ref(false)
const router = useRouter()

const submitForm = async () => {
  // Validate required fields
  if (!form.value.empName || !form.value.department || 
      isNaN(form.value.experience) || !form.value.address || 
      !form.value.birthdate) {
    showMessage('All fields are required except photo', false)
    return
  }

  // Validate experience range
  const experience = parseInt(form.value.experience)
  if (experience < 0 || experience > 50) {
    showMessage('Experience must be between 0-50 years', false)
    return
  }

  // Validate birthdate is in the past
  const birthdate = new Date(form.value.birthdate)
  if (birthdate > new Date()) {
    showMessage('Birthdate cannot be in the future', false)
    return
  }

  // Validate photo URL if provided
  if (form.value.employePhoto && !isValidUrl(form.value.employePhoto)) {
    showMessage('Please enter a valid URL for the photo (e.g., https://example.com/image.jpg)', false)
    return
  }

  // Format birthdate to YYYY-MM-DD
  const formattedBirthdate = birthdate.toISOString().split('T')[0]

  loading.value = true
  message.value = ''
  
  try {
    const response = await axios.post('https://backendwithgo.onrender.com/graphql', 
      {
        query: `
          mutation AddEmployee(
            $empName: String!,
            $department: String!,
            $experience: Int!,
            $address: String!,
            $birthdate: String!,
            $employePhoto: String
          ) {
            addEmployee(
              empName: $empName,
              department: $department,
              experience: $experience,
              address: $address,
              birthdate: $birthdate,
              employePhoto: $employePhoto
            ) {
              id
              empName
              department
              experience
              address
              birthdate
              employePhoto
            }
          }
        `,
        variables: {
          empName: form.value.empName.trim(),
          department: form.value.department.trim(),
          experience: experience,
          address: form.value.address.trim(),
          birthdate: formattedBirthdate,
          employePhoto: form.value.employePhoto?.trim() || null
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    )

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message)
    }

    if (!response.data.data?.addEmployee) {
      throw new Error('Failed to add employee: No data returned')
    }

    const newEmployee = response.data.data.addEmployee
    showMessage(`Successfully added ${newEmployee.empName} to ${newEmployee.department}`, true)
    
    // Reset form
    form.value = {
      empName: '',
      department: '',
      experience: 0,
      address: '',
      birthdate: '',
      employePhoto: ''
    }
    
    // Redirect after delay
    setTimeout(() => router.push('/admin/view'), 1500)

  } catch (error) {
    console.error('Error adding employee:', error)
    showMessage(
      error.response?.data?.errors?.[0]?.message || 
      error.message || 
      'Failed to add employee', 
      false
    )
  } finally {
    loading.value = false
  }
}
function isValidUrl(string) {
  try {
    // Basic URL validation
    const url = new URL(string)
    
    // Additional checks for photo URLs
    const validProtocols = ['http:', 'https:']
    if (!validProtocols.includes(url.protocol)) {
      return false
    }
    
    // Optionally check for common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
    const hasImageExtension = imageExtensions.some(ext => 
      url.pathname.toLowerCase().endsWith(ext)
    )
    
    return hasImageExtension // Return true only if it looks like an image URL
  } catch (_) {
    return false  
  }
}
const validatePhotoUrl = () => {
  if (form.value.employePhoto && !isValidUrl(form.value.employePhoto)) {
    showMessage('Please enter a valid URL for the photo', false)
  }
}
const showMessage = (msg, isSuccess) => {
  message.value = msg
  success.value = isSuccess
  setTimeout(() => message.value = '', 5000)
}
</script>

<template>
  <AdminNav/>
  <div class="add-employee-container">
    <h2 class="page-title">Add New Employee</h2>

    <form @submit.prevent="submitForm" class="employee-form">
      <!-- Employee Name -->
      <div class="form-group">
        <label for="empName">Employee Name</label>
        <input 
          type="text" 
          id="empName" 
          v-model="form.empName" 
          class="input-field" 
          required 
          placeholder="Enter employee name"
        />
      </div>

      <!-- Department -->
      <div class="form-group">
        <label for="department">Department</label>
        <input 
          type="text" 
          id="department" 
          v-model="form.department" 
          class="input-field" 
          required 
          placeholder="Enter department"
        />
      </div>

      <!-- Experience -->
      <div class="form-group">
        <label for="experience">Experience (in years)</label>
        <input 
          type="number" 
          id="experience" 
          v-model.number="form.experience" 
          class="input-field" 
          required 
          min="0"
          max="50"
          placeholder="Enter years of experience"
        />
      </div>

      <!-- Address -->
      <div class="form-group">
        <label for="address">Address</label>
        <textarea 
          id="address" 
          v-model="form.address" 
          class="input-field" 
          required 
          placeholder="Enter address"
        ></textarea>
      </div>

      <!-- Birthdate -->
      <div class="form-group">
        <label for="birthdate">Birthdate</label>
        <input 
          type="date" 
          id="birthdate" 
          v-model="form.birthdate" 
          class="input-field" 
          required 
          :max="new Date().toISOString().split('T')[0]"
        />
      </div>

      <!-- Employee Photo -->
      <div class="form-group">
  <label for="employePhoto">Employee Photo URL</label>
  <input 
    type="url" 
    id="employePhoto" 
    v-model="form.employePhoto" 
    class="input-field" 
    placeholder="Enter photo URL (optional)"
    @blur="validatePhotoUrl"
  />
  <small v-if="form.employePhoto && !isValidUrl(form.employePhoto)" class="error-text">
    Please enter a valid URL (e.g., https://example.com/photo.jpg)
  </small>
</div>

      <!-- Submit Button -->
      <div class="form-group">
        <button type="submit" class="submit-button" :disabled="loading">
          <span v-if="loading">
            <i class="fa fa-spinner fa-spin"></i> Adding...
          </span>
          <span v-else>Add Employee</span>
        </button>
      </div>
    </form>

    <!-- Success/Error Messages -->
    <div v-if="message" :class="['message', success ? 'success-message' : 'error-message']">
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.add-employee-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
}

.employee-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-field {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

textarea.input-field {
  min-height: 80px;
  resize: vertical;
}

.submit-button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #3aa876;
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.message {
  padding: 12px;
  margin-top: 20px;
  border-radius: 4px;
  text-align: center;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.fa-spinner {
  margin-right: 8px;
}
</style>