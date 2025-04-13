<template>
<div>
 
</div>
  <div class="employee-list fantasy-scroll">
    <h2 class="fantasy-title">Guild Members' Records</h2>
    
    <div v-if="loading" class="fantasy-loading">
      <div class="spinner"></div>
      Summoning data from the archives...
    </div>
    
    <div v-else-if="error" class="fantasy-error">
      ⚠️ A dark force blocks our path: {{ error }}
    </div>
    
    <div v-else>
      <div v-if="employees.length === 0" class="fantasy-empty">
        The guild hall appears empty... no members found
      </div>
      
      <div v-else>
        <div v-for="emp in employees" :key="emp.id" class="employee-card enchanted-card">
          <div class="spell-controls">
            <button @click="openEditModal(emp)" class="spell-button edit-spell">
              <i class="fas fa-scroll"></i> Edit Scroll
            </button>
            <button @click="confirmDelete(emp.id)" class="spell-button banish-spell">
              <i class="fas fa-broom"></i> Banish
            </button>
          </div>
          
          <h3 class="member-name">🧙 {{ emp.empName }}</h3>
          <p><strong>Guild ID:</strong> {{ emp.empId }}</p>
          <p><strong>Order:</strong> {{ emp.department || 'Unknown Order' }}</p>
          <p><strong>Years of Mastery:</strong> {{ emp.experience || 'Mysterious past' }} years</p>
          <p><strong>Realm of Residence:</strong> {{ emp.address || 'Hidden realm' }}</p>
          <p><strong>Moonbirth:</strong> {{ formatDate(emp.birthdate) || 'Unknown cycle' }}</p>
          
          <div v-if="emp.employePhoto" class="portrait-container">
            <strong>Portrait:</strong> 
            <img 
              :src="emp.employePhoto" 
              :alt="`Portrait of ${emp.empName || 'employee'}`" 
              class="employee-photo enchanted-photo"
              @error="handleImageError"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content enchanted-card">
        <h3 class="modal-title">Edit Guild Member's Scroll</h3>
        
        <div class="form-group">
          <label>Name</label>
          <input v-model="editingEmployee.empName" class="modal-input">
        </div>
        
        <div class="form-group">
          <label>Order</label>
          <select v-model="editingEmployee.department" class="modal-input">
            <option value="computerScience">computer-science</option>
            <option value="nutrition">Human-nutrition</option>
            <option value="medicaldoctor">Medical doctor</option>
            <option value="civil">Civil-Engineering</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Years of Mastery</label>
          <input v-model.number="editingEmployee.experience" type="number" min="0" max="50" class="modal-input">
        </div>
        
        <div class="form-group">
          <label>Realm</label>
          <textarea v-model="editingEmployee.address" class="modal-input"></textarea>
        </div>
        
        <div class="form-group">
          <label>Moonbirth</label>
          <input v-model="editingEmployee.birthdate" type="date" class="modal-input">
        </div>
        
        <div class="form-group">
          <label>Portrait URL</label>
          <input v-model="editingEmployee.employePhoto" class="modal-input">
        </div>
        
        <div class="modal-actions">
          <button @click="updateEmployee" class="spell-button save-spell" :disabled="updating">
            <span v-if="updating">Scribing...</span>
            <span v-else><i class="fas fa-save"></i> Save Changes</span>
          </button>
          <button @click="showEditModal = false" class="spell-button cancel-spell">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="modal-content enchanted-card">
        <h3 class="modal-title">Banish Member from Guild?</h3>
        <p>This action cannot be undone. The member's records will be erased from all archives.</p>
        <div class="modal-actions">
         <!-- In your delete confirmation modal -->
<button @click="deleteEmployee" class="spell-button banish-spell" :disabled="deleting">
  <span v-if="deleting">Banishing...</span>
  <span v-else><i class="fas fa-broom"></i> Confirm Banishment</span>
</button>
          <button @click="showDeleteConfirm = false" class="spell-button cancel-spell">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/api'
export default {
  name: 'EmployeeList',
  data() {
    return {
      employees: [],
      loading: false,
      error: null,
      showEditModal: false,
      showDeleteConfirm: false,
      updating: false,
      deleting: false,
      editingEmployee: {
        id: null,
        empName: '',
        department: '',
        experience: 0,
        address: '',
        birthdate: '',
        employePhoto: ''
      },
      employeeToDelete: null
    }
  },
  async created() {
    if (!localStorage.getItem('token')) {
      this.$router.push('/login')
      return
    }
    await this.fetchEmployees()
  },
  methods: {
    async fetchEmployees() {
      try {
        this.loading = true
        this.error = null
        const data = await api.queryGraphQL(`
          query GetEmployeeDetails {
            employeeDetails {
              id
              empId
              empName
              department
              experience
              address
              birthdate
              employePhoto
            }
          }
        `)
        this.employees = data?.employeeDetails || []
      } catch (err) {
        console.error('Error fetching employees:', err)
        this.error = err.message || 'Failed to load employee data'
        if (err.message.includes('token') || err.message.includes('auth')) {
          localStorage.removeItem('token')
          this.$router.push('/login')
        }
      } finally {
        this.loading = false
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'Unknown cycle'
      try {
        const date = new Date(dateString)
        return isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch {
        return 'Invalid date'
      }
    },
    handleImageError(event) {
      event.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%235b3c11"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10">No Portrait</text></svg>'
    },
    openEditModal(emp) {
      this.editingEmployee = { 
        ...emp,
        birthdate: emp.birthdate ? emp.birthdate.split('T')[0] : '' // Format for date input
      }
      this.showEditModal = true
    },
    async updateEmployee() {
      try {
        this.updating = true
        await api.queryGraphQL(`
       mutation UpdateEmployee($id: Int!, $empName: String!, $department: String!, $experience: Int!, $address: String!, $birthdate: String!, $employePhoto: String) {
  updateEmployee(
    id: $id
    empName: $empName
    department: $department
    experience: $experience
    address: $address
    birthdate: $birthdate
    employePhoto: $employePhoto
  ) {
    id
    empName
    department
    experience
  }
}
        `, {
          id: this.editingEmployee.id,
          empName: this.editingEmployee.empName,
          department: this.editingEmployee.department,
          experience: this.editingEmployee.experience,
          address: this.editingEmployee.address,
          birthdate: this.editingEmployee.birthdate,
          employePhoto: this.editingEmployee.employePhoto
        })

        alert(`${this.editingEmployee.empName}'s scroll has been updated!`)
        this.showEditModal = false
        await this.fetchEmployees()
      } catch (err) {
        alert(`Failed to update scroll: ${err.message}`)
        console.error('Update error:', err)
      } finally {
        this.updating = false
      }
    },
    confirmDelete(id) {
      this.employeeToDelete = id
      this.showDeleteConfirm = true
    },
    async deleteEmployee() {  // Remove the id parameter since we're using employeeToDelete
  try {
    this.deleting = true;
    const id = this.employeeToDelete; // Get the stored ID
    
    console.log('Attempting to delete employee ID:', id);
    
    const response = await api.queryGraphQL(`
      mutation DeleteEmployee($id: Int!) {
        deleteEmployee(id: $id)
      }
    `, { id: id });

    console.log('Delete response:', response);

    if (response.errors) {
      const errorMsg = response.errors.map(e => e.message).join(', ');
      throw new Error(`GraphQL Error: ${errorMsg}`);
    }

    if (!response.data?.deleteEmployee) {
      throw new Error('Deletion failed - no data returned');
    }

    alert('Member has been banished from the guild!');
    this.showDeleteConfirm = false;
    await this.fetchEmployees(); // Refresh the list
  } catch (error) {
    console.error('Delete failed:', error);
    alert(`Banishment failed: ${error.message}`);
  } finally {
    this.deleting = false;
  }
}
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.fantasy-scroll {
  font-family: 'MedievalSharp', cursive;
  background: #f4f1e1;
  border: 2px solid #c2a36b;
  border-radius: 15px;
  padding: 2rem;
  max-width: 900px;
  margin: 3rem auto;
  box-shadow: 0 0 15px rgba(190, 166, 102, 0.6);
  position: relative;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #5b3c11;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fantasy-title {
  text-align: center;
  font-size: 2rem;
  color: #5b3c11;
  margin-bottom: 2rem;
  text-shadow: 1px 1px #c6b179;
}

.fantasy-loading {
  text-align: center;
  font-size: 1.2rem;
  color: #7c2d12;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.fantasy-error {
  color: #a80f0f;
  font-weight: bold;
  border: 1px solid #a80f0f;
  background-color: #fdecea;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.fantasy-empty {
  text-align: center;
  font-size: 1.2rem;
  color: #5b3c11;
  font-style: italic;
}

.employee-card {
  background: #fff8e6;
  border: 2px dashed #cfa45e;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 10px rgba(210, 180, 140, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.employee-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(223, 191, 130, 0.6);
}

.spell-controls {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.spell-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'MedievalSharp', cursive;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.spell-button i {
  font-size: 1rem;
}

.edit-spell {
  background-color: #f0ad4e;
  color: #5b3c11;
}

.edit-spell:hover {
  background-color: #ec971f;
}

.banish-spell {
  background-color: #d9534f;
  color: white;
}

.banish-spell:hover {
  background-color: #c9302c;
}

.save-spell {
  background-color: #5cb85c;
  color: white;
}

.save-spell:hover {
  background-color: #4cae4c;
}

.cancel-spell {
  background-color: #5b3c11;
  color: white;
}

.cancel-spell:hover {
  background-color: #3a240d;
}

.member-name {
  color: #3a240d;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.portrait-container {
  margin-top: 1rem;
}

.employee-photo {
  display: block;
  margin-top: 0.5rem;
  max-width: 120px;
  max-height: 120px;
  border: 3px solid #cfa45e;
  border-radius: 10px;
  box-shadow: 0 0 6px #dec28a;
  background-color: #f4f1e1;
}

.enchanted-photo {
  filter: brightness(1.1) contrast(1.05) saturate(1.2);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff8e6;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-title {
  color: #5b3c11;
  margin-bottom: 1.5rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #5b3c11;
}

.modal-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #c2a36b;
  border-radius: 5px;
  font-family: 'MedievalSharp', cursive;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .fantasy-scroll {
    padding: 1rem;
    margin: 1.5rem auto;
  }
  
  .employee-card {
    padding: 1rem;
  }
  
  .spell-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>