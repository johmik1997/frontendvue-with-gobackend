<template>
    <div class="announcement-container">
        <div class="announcement-content">
            <div class="announcement-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            </div>
            <h2 class="announcement-title">No Announcements Found</h2>
            <p class="announcement-message">
                We'll post important updates here when they become available.
                Please check back later for news and announcements.
            </p>
        </div>
    </div>
</template>
<style scoped>
.announcement-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    margin: 2rem;
    text-align: center;
}

.announcement-content {
    max-width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

.announcement-icon {
    color: #6c757d;
    opacity: 0.7;
}

.announcement-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: #343a40;
    margin: 0;
}

.announcement-message {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #495057;
    margin: 0;
    opacity: 0.9;
}

/* Animation */
.announcement-icon {
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .announcement-container {
        margin: 1rem;
        padding: 1.5rem;
        min-height: 250px;
    }
    
    .announcement-title {
        font-size: 1.5rem;
    }
    
    .announcement-message {
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .announcement-container {
        margin: 0.5rem;
        padding: 1rem;
    }
    
    .announcement-title {
        font-size: 1.3rem;
    }
}
</style>