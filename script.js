// Global state
let currentStep = 1
const totalSteps = 6
let projectData = {}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadFromSession()
  updateProgress()
  updateNavigation()
  setupEventListeners()
})

// Event listeners
function setupEventListeners() {
  // Auto-save on input changes
  document.addEventListener("input", saveToSession)
  document.addEventListener("change", saveToSession)

  // Date validation
  document.getElementById("startDate").addEventListener("change", validateDates)
  document.getElementById("endDate").addEventListener("change", validateDates)

  // Form validation on blur
  document.querySelectorAll("input[required], textarea[required]").forEach((input) => {
    input.addEventListener("blur", validateField)
  })
}

// Navigation functions
function nextStep() {
  if (validateCurrentStep()) {
    if (currentStep < totalSteps) {
      currentStep++
      showStep(currentStep)
      updateProgress()
      updateNavigation()
      saveToSession()
    }
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--
    showStep(currentStep)
    updateProgress()
    updateNavigation()
  }
}

function showStep(step) {
  // Hide all steps
  document.querySelectorAll(".step-container").forEach((container) => {
    container.classList.remove("active")
  })

  // Show current step
  document.getElementById(`step${step}`).classList.add("active")

  // Update step indicators
  document.querySelectorAll(".step-dot").forEach((dot, index) => {
    dot.classList.remove("active", "completed")
    if (index + 1 === step) {
      dot.classList.add("active")
    } else if (index + 1 < step) {
      dot.classList.add("completed")
    }
  })

  // Scroll to top
  window.scrollTo(0, 0)
}

function updateProgress() {
  const progressFill = document.getElementById("progressFill")
  const percentage = (currentStep / totalSteps) * 100
  progressFill.style.width = `${percentage}%`
}

function updateNavigation() {
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const finishBtn = document.getElementById("finishBtn")

  prevBtn.disabled = currentStep === 1

  if (currentStep === totalSteps) {
    nextBtn.style.display = "none"
    finishBtn.style.display = "inline-block"
  } else {
    nextBtn.style.display = "inline-block"
    finishBtn.style.display = "none"
  }
}

// Validation functions
function validateCurrentStep() {
  const currentStepElement = document.getElementById(`step${currentStep}`)
  const requiredFields = currentStepElement.querySelectorAll("input[required], textarea[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!validateField({ target: field })) {
      isValid = false
    }
  })

  // Additional validation for specific steps
  if (currentStep === 4) {
    isValid = validateDates() && isValid
  }

  if (!isValid) {
    showNotification("Please fill in all required fields correctly.", "error")
  }

  return isValid
}

function validateField(event) {
  const field = event.target
  const value = field.value.trim()

  // Remove existing error state
  field.classList.remove("error")

  // Check if required field is empty
  if (field.hasAttribute("required") && !value) {
    field.classList.add("error")
    return false
  }

  // Validate dates
  if (field.type === "date" && value) {
    const date = new Date(value)
    if (isNaN(date.getTime())) {
      field.classList.add("error")
      return false
    }
  }

  return true
}

function validateDates() {
  const startDate = document.getElementById("startDate")
  const endDate = document.getElementById("endDate")

  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)

    if (start >= end) {
      endDate.classList.add("error")
      showNotification("End date must be after start date.", "error")
      return false
    } else {
      startDate.classList.remove("error")
      endDate.classList.remove("error")
    }
  }

  return true
}

// Dynamic list management
function addStakeholder() {
  const container = document.getElementById("stakeholdersContainer")
  const newItem = document.createElement("div")
  newItem.className = "stakeholder-item"
  newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Name *</label>
                <input type="text" name="stakeholderName" required>
            </div>
            <div class="form-group">
                <label>Role *</label>
                <input type="text" name="stakeholderRole" required>
            </div>
            <button type="button" class="remove-btn" onclick="removeStakeholder(this)">×</button>
        </div>
    `
  container.appendChild(newItem)

  // Add event listeners to new inputs
  newItem.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", saveToSession)
    input.addEventListener("blur", validateField)
  })
}

function removeStakeholder(button) {
  const item = button.closest(".stakeholder-item")
  if (document.querySelectorAll(".stakeholder-item").length > 1) {
    item.remove()
    saveToSession()
  }
}

function addGoal() {
  const container = document.getElementById("goalsContainer")
  const newItem = document.createElement("div")
  newItem.className = "goal-item"
  newItem.innerHTML = `
        <div class="form-group">
            <label>Goal *</label>
            <input type="text" name="goal" required>
            <button type="button" class="remove-btn" onclick="removeGoal(this)">×</button>
        </div>
    `
  container.appendChild(newItem)

  // Add event listeners
  const input = newItem.querySelector("input")
  input.addEventListener("input", saveToSession)
  input.addEventListener("blur", validateField)
}

function removeGoal(button) {
  const item = button.closest(".goal-item")
  if (document.querySelectorAll(".goal-item").length > 1) {
    item.remove()
    saveToSession()
  }
}

function addMilestone() {
  const container = document.getElementById("milestonesContainer")
  const newItem = document.createElement("div")
  newItem.className = "milestone-item"
  newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Milestone *</label>
                <input type="text" name="milestone" required>
            </div>
            <div class="form-group">
                <label>Date *</label>
                <input type="date" name="milestoneDate" required>
            </div>
            <button type="button" class="remove-btn" onclick="removeMilestone(this)">×</button>
        </div>
    `
  container.appendChild(newItem)

  // Add event listeners
  newItem.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", saveToSession)
    input.addEventListener("change", saveToSession)
    input.addEventListener("blur", validateField)
  })
}

function removeMilestone(button) {
  const item = button.closest(".milestone-item")
  if (document.querySelectorAll(".milestone-item").length > 1) {
    item.remove()
    saveToSession()
  }
}

function addResponsibility() {
  const container = document.getElementById("responsibilitiesContainer")
  const newItem = document.createElement("div")
  newItem.className = "responsibility-item"
  newItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Task/Responsibility *</label>
                <input type="text" name="task" required>
            </div>
            <div class="form-group">
                <label>Assigned To *</label>
                <input type="text" name="assignee" required>
            </div>
            <button type="button" class="remove-btn" onclick="removeResponsibility(this)">×</button>
        </div>
    `
  container.appendChild(newItem)

  // Add event listeners
  newItem.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", saveToSession)
    input.addEventListener("blur", validateField)
  })
}

function removeResponsibility(button) {
  const item = button.closest(".responsibility-item")
  if (document.querySelectorAll(".responsibility-item").length > 1) {
    item.remove()
    saveToSession()
  }
}

// Session management
function saveToSession() {
  const data = {
    currentStep: currentStep,
    projectTitle: document.getElementById("projectTitle")?.value || "",
    projectDescription: document.getElementById("projectDescription")?.value || "",
    stakeholders: getStakeholders(),
    goals: getGoals(),
    successCriteria: document.getElementById("successCriteria")?.value || "",
    startDate: document.getElementById("startDate")?.value || "",
    endDate: document.getElementById("endDate")?.value || "",
    milestones: getMilestones(),
    responsibilities: getResponsibilities(),
    dependencies: document.getElementById("dependencies")?.value || "",
    risks: document.getElementById("risks")?.value || "",
  }

  sessionStorage.setItem("projectScopeData", JSON.stringify(data))
  projectData = data
}

function loadFromSession() {
  const saved = sessionStorage.getItem("projectScopeData")
  if (saved) {
    const data = JSON.parse(saved)
    projectData = data
    currentStep = data.currentStep || 1

    // Restore form values
    if (data.projectTitle) document.getElementById("projectTitle").value = data.projectTitle
    if (data.projectDescription) document.getElementById("projectDescription").value = data.projectDescription
    if (data.successCriteria) document.getElementById("successCriteria").value = data.successCriteria
    if (data.startDate) document.getElementById("startDate").value = data.startDate
    if (data.endDate) document.getElementById("endDate").value = data.endDate
    if (data.dependencies) document.getElementById("dependencies").value = data.dependencies
    if (data.risks) document.getElementById("risks").value = data.risks

    // Restore dynamic lists
    restoreStakeholders(data.stakeholders)
    restoreGoals(data.goals)
    restoreMilestones(data.milestones)
    restoreResponsibilities(data.responsibilities)

    showStep(currentStep)
  }
}

// Data collection functions
function getStakeholders() {
  const stakeholders = []
  document.querySelectorAll(".stakeholder-item").forEach((item) => {
    const name = item.querySelector('input[name="stakeholderName"]').value
    const role = item.querySelector('input[name="stakeholderRole"]').value
    if (name && role) {
      stakeholders.push({ name, role })
    }
  })
  return stakeholders
}

function getGoals() {
  const goals = []
  document.querySelectorAll(".goal-item").forEach((item) => {
    const goal = item.querySelector('input[name="goal"]').value
    if (goal) {
      goals.push(goal)
    }
  })
  return goals
}

function getMilestones() {
  const milestones = []
  document.querySelectorAll(".milestone-item").forEach((item) => {
    const milestone = item.querySelector('input[name="milestone"]').value
    const date = item.querySelector('input[name="milestoneDate"]').value
    if (milestone && date) {
      milestones.push({ milestone, date })
    }
  })
  return milestones
}

function getResponsibilities() {
  const responsibilities = []
  document.querySelectorAll(".responsibility-item").forEach((item) => {
    const task = item.querySelector('input[name="task"]').value
    const assignee = item.querySelector('input[name="assignee"]').value
    if (task && assignee) {
      responsibilities.push({ task, assignee })
    }
  })
  return responsibilities
}

// Data restoration functions
function restoreStakeholders(stakeholders) {
  if (!stakeholders || stakeholders.length === 0) return

  const container = document.getElementById("stakeholdersContainer")
  container.innerHTML = ""

  stakeholders.forEach((stakeholder) => {
    const item = document.createElement("div")
    item.className = "stakeholder-item"
    item.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Name *</label>
                    <input type="text" name="stakeholderName" value="${stakeholder.name}" required>
                </div>
                <div class="form-group">
                    <label>Role *</label>
                    <input type="text" name="stakeholderRole" value="${stakeholder.role}" required>
                </div>
                <button type="button" class="remove-btn" onclick="removeStakeholder(this)">×</button>
            </div>
        `
    container.appendChild(item)

    // Add event listeners
    item.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", saveToSession)
      input.addEventListener("blur", validateField)
    })
  })
}

function restoreGoals(goals) {
  if (!goals || goals.length === 0) return

  const container = document.getElementById("goalsContainer")
  container.innerHTML = ""

  goals.forEach((goal) => {
    const item = document.createElement("div")
    item.className = "goal-item"
    item.innerHTML = `
            <div class="form-group">
                <label>Goal *</label>
                <input type="text" name="goal" value="${goal}" required>
                <button type="button" class="remove-btn" onclick="removeGoal(this)">×</button>
            </div>
        `
    container.appendChild(item)

    // Add event listeners
    const input = item.querySelector("input")
    input.addEventListener("input", saveToSession)
    input.addEventListener("blur", validateField)
  })
}

function restoreMilestones(milestones) {
  if (!milestones || milestones.length === 0) return

  const container = document.getElementById("milestonesContainer")
  container.innerHTML = ""

  milestones.forEach((milestone) => {
    const item = document.createElement("div")
    item.className = "milestone-item"
    item.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Milestone *</label>
                    <input type="text" name="milestone" value="${milestone.milestone}" required>
                </div>
                <div class="form-group">
                    <label>Date *</label>
                    <input type="date" name="milestoneDate" value="${milestone.date}" required>
                </div>
                <button type="button" class="remove-btn" onclick="removeMilestone(this)">×</button>
            </div>
        `
    container.appendChild(item)

    // Add event listeners
    item.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", saveToSession)
      input.addEventListener("change", saveToSession)
      input.addEventListener("blur", validateField)
    })
  })
}

function restoreResponsibilities(responsibilities) {
  if (!responsibilities || responsibilities.length === 0) return

  const container = document.getElementById("responsibilitiesContainer")
  container.innerHTML = ""

  responsibilities.forEach((responsibility) => {
    const item = document.createElement("div")
    item.className = "responsibility-item"
    item.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Task/Responsibility *</label>
                    <input type="text" name="task" value="${responsibility.task}" required>
                </div>
                <div class="form-group">
                    <label>Assigned To *</label>
                    <input type="text" name="assignee" value="${responsibility.assignee}" required>
                </div>
                <button type="button" class="remove-btn" onclick="removeResponsibility(this)">×</button>
            </div>
        `
    container.appendChild(item)

    // Add event listeners
    item.querySelectorAll("input").forEach((input) => {
      input.addEventListener("input", saveToSession)
      input.addEventListener("blur", validateField)
    })
  })
}

// Finish wizard
function finishWizard() {
  if (validateCurrentStep()) {
    document.getElementById("modalOverlay").style.display = "flex"
  }
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none"
}

function confirmFinish() {
  closeModal()
  showLoading()

  // Simulate processing time
  setTimeout(() => {
    hideLoading()
    calculateScore()
    generateSummary()
    showSummary()
  }, 2000)
}

function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex"
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none"
}

// Score calculation
function calculateScore() {
  let score = 0
  const maxScore = 100

  // Project basics (20 points)
  if (projectData.projectTitle && projectData.projectTitle.length > 3) score += 10
  if (projectData.projectDescription && projectData.projectDescription.length > 20) score += 10

  // Stakeholders (15 points)
  if (projectData.stakeholders && projectData.stakeholders.length >= 2) score += 15
  else if (projectData.stakeholders && projectData.stakeholders.length >= 1) score += 10

  // Goals and success criteria (20 points)
  if (projectData.goals && projectData.goals.length >= 2) score += 10
  else if (projectData.goals && projectData.goals.length >= 1) score += 5
  if (projectData.successCriteria && projectData.successCriteria.length > 20) score += 10

  // Timeline (20 points)
  if (projectData.startDate && projectData.endDate) {
    const start = new Date(projectData.startDate)
    const end = new Date(projectData.endDate)
    const duration = (end - start) / (1000 * 60 * 60 * 24) // days

    if (duration > 0 && duration <= 365) score += 10 // Reasonable timeline
    if (projectData.milestones && projectData.milestones.length >= 2) score += 10
    else if (projectData.milestones && projectData.milestones.length >= 1) score += 5
  }

  // Responsibilities (15 points)
  if (projectData.responsibilities && projectData.responsibilities.length >= 3) score += 15
  else if (projectData.responsibilities && projectData.responsibilities.length >= 1) score += 10

  // Risk management (10 points)
  if (projectData.dependencies && projectData.dependencies.length > 10) score += 5
  if (projectData.risks && projectData.risks.length > 10) score += 5

  return Math.min(score, maxScore)
}

function getScoreMessage(score) {
  if (score >= 90) {
    return "Excellent! Your project scope is comprehensive and well-defined. You're ready to start with confidence."
  } else if (score >= 75) {
    return "Great! Your project scope is well-defined with minor areas for improvement."
  } else if (score >= 60) {
    return "Good foundation! Consider refining your timeline, goals, and risk assessment before starting."
  } else if (score >= 40) {
    return "Needs work: Please clarify your goals, timeline, and responsibilities before proceeding."
  } else {
    return "Significant improvements needed: Your project scope requires substantial development before starting."
  }
}

// Summary generation
function generateSummary() {
  const score = calculateScore()
  const scoreMessage = getScoreMessage(score)

  // Update score display
  document.getElementById("scoreValue").textContent = `${score}%`
  document.getElementById("scoreMessage").textContent = scoreMessage

  // Generate summary content
  const summaryContent = document.getElementById("summaryContent")
  summaryContent.innerHTML = `
        <div class="summary-section">
            <h3>Project Overview</h3>
            <p><strong>Title:</strong> ${projectData.projectTitle || "Not specified"}</p>
            <p><strong>Description:</strong> ${projectData.projectDescription || "Not specified"}</p>
        </div>
        
        <div class="summary-section">
            <h3>Key Stakeholders</h3>
            ${
              projectData.stakeholders && projectData.stakeholders.length > 0
                ? `<ul>${projectData.stakeholders.map((s) => `<li><strong>${s.name}</strong> - ${s.role}</li>`).join("")}</ul>`
                : "<p>No stakeholders specified</p>"
            }
        </div>
        
        <div class="summary-section">
            <h3>Goals & Success Criteria</h3>
            ${
              projectData.goals && projectData.goals.length > 0
                ? `<ul>${projectData.goals.map((g) => `<li>${g}</li>`).join("")}</ul>`
                : "<p>No goals specified</p>"
            }
            <p><strong>Success Criteria:</strong> ${projectData.successCriteria || "Not specified"}</p>
        </div>
        
        <div class="summary-section">
            <h3>Timeline</h3>
            <p><strong>Start Date:</strong> ${projectData.startDate ? new Date(projectData.startDate).toLocaleDateString() : "Not specified"}</p>
            <p><strong>End Date:</strong> ${projectData.endDate ? new Date(projectData.endDate).toLocaleDateString() : "Not specified"}</p>
            ${
              projectData.milestones && projectData.milestones.length > 0
                ? `<p><strong>Milestones:</strong></p><ul>${projectData.milestones.map((m) => `<li>${m.milestone} - ${new Date(m.date).toLocaleDateString()}</li>`).join("")}</ul>`
                : "<p>No milestones specified</p>"
            }
        </div>
        
        <div class="summary-section">
            <h3>Responsibilities</h3>
            ${
              projectData.responsibilities && projectData.responsibilities.length > 0
                ? `<ul>${projectData.responsibilities.map((r) => `<li><strong>${r.task}</strong> - ${r.assignee}</li>`).join("")}</ul>`
                : "<p>No responsibilities specified</p>"
            }
        </div>
        
        <div class="summary-section">
            <h3>Dependencies & Risks</h3>
            <p><strong>Dependencies:</strong> ${projectData.dependencies || "None specified"}</p>
            <p><strong>Risks:</strong> ${projectData.risks || "None specified"}</p>
        </div>
    `
}

function showSummary() {
  // Hide all step containers
  document.querySelectorAll(".step-container").forEach((container) => {
    container.classList.remove("active")
  })

  // Show summary
  document.getElementById("summary").style.display = "block"

  // Hide navigation
  document.querySelector(".navigation").style.display = "none"

  // Update progress to 100%
  document.getElementById("progressFill").style.width = "100%"

  // Update step indicators
  document.querySelectorAll(".step-dot").forEach((dot) => {
    dot.classList.remove("active")
    dot.classList.add("completed")
  })

  // Scroll to top
  window.scrollTo(0, 0)
}

// Output functions
function copyToClipboard() {
  const summaryText = generateTextSummary()

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(summaryText)
      .then(() => {
        showNotification("Summary copied to clipboard!", "success")
      })
      .catch(() => {
        fallbackCopyToClipboard(summaryText)
      })
  } else {
    fallbackCopyToClipboard(summaryText)
  }
}

function fallbackCopyToClipboard(text) {
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  textArea.style.left = "-999999px"
  textArea.style.top = "-999999px"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand("copy")
    showNotification("Summary copied to clipboard!", "success")
  } catch (err) {
    showNotification("Failed to copy to clipboard", "error")
  }

  document.body.removeChild(textArea)
}

function generateTextSummary() {
  const score = calculateScore()
  const scoreMessage = getScoreMessage(score)

  let summary = `PROJECT SCOPE VALIDATOR SUMMARY\n`
  summary += `Generated on: ${new Date().toLocaleDateString()}\n`
  summary += `Readiness Score: ${score}%\n`
  summary += `Assessment: ${scoreMessage}\n\n`

  summary += `PROJECT OVERVIEW\n`
  summary += `Title: ${projectData.projectTitle || "Not specified"}\n`
  summary += `Description: ${projectData.projectDescription || "Not specified"}\n\n`

  summary += `KEY STAKEHOLDERS\n`
  if (projectData.stakeholders && projectData.stakeholders.length > 0) {
    projectData.stakeholders.forEach((s) => {
      summary += `• ${s.name} - ${s.role}\n`
    })
  } else {
    summary += `No stakeholders specified\n`
  }
  summary += `\n`

  summary += `GOALS & SUCCESS CRITERIA\n`
  if (projectData.goals && projectData.goals.length > 0) {
    projectData.goals.forEach((g) => {
      summary += `• ${g}\n`
    })
  } else {
    summary += `No goals specified\n`
  }
  summary += `Success Criteria: ${projectData.successCriteria || "Not specified"}\n\n`

  summary += `TIMELINE\n`
  summary += `Start Date: ${projectData.startDate ? new Date(projectData.startDate).toLocaleDateString() : "Not specified"}\n`
  summary += `End Date: ${projectData.endDate ? new Date(projectData.endDate).toLocaleDateString() : "Not specified"}\n`
  if (projectData.milestones && projectData.milestones.length > 0) {
    summary += `Milestones:\n`
    projectData.milestones.forEach((m) => {
      summary += `• ${m.milestone} - ${new Date(m.date).toLocaleDateString()}\n`
    })
  } else {
    summary += `No milestones specified\n`
  }
  summary += `\n`

  summary += `RESPONSIBILITIES\n`
  if (projectData.responsibilities && projectData.responsibilities.length > 0) {
    projectData.responsibilities.forEach((r) => {
      summary += `• ${r.task} - ${r.assignee}\n`
    })
  } else {
    summary += `No responsibilities specified\n`
  }
  summary += `\n`

  summary += `DEPENDENCIES & RISKS\n`
  summary += `Dependencies: ${projectData.dependencies || "None specified"}\n`
  summary += `Risks: ${projectData.risks || "None specified"}\n`

  return summary
}

function downloadPDF() {
  // Create a printable version
  const printWindow = window.open("", "_blank")
  const summaryHTML = generatePrintableHTML()

  printWindow.document.write(summaryHTML)
  printWindow.document.close()

  // Wait for content to load, then print
  printWindow.onload = () => {
    printWindow.print()
    printWindow.close()
  }

  showNotification("Opening print dialog for PDF download...", "info")
}

function generatePrintableHTML() {
  const score = calculateScore()
  const scoreMessage = getScoreMessage(score)

  return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Project Scope Summary</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1 { color: #4f8a8b; border-bottom: 2px solid #4f8a8b; padding-bottom: 10px; }
                h2 { color: #2c3e50; margin-top: 30px; }
                .score { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
                .score-value { font-size: 2em; font-weight: bold; color: #4f8a8b; }
                ul { padding-left: 20px; }
                li { margin-bottom: 5px; }
                .date { font-style: italic; color: #666; }
            </style>
        </head>
        <body>
            <h1>Project Scope Validator Summary</h1>
            <p class="date">Generated on: ${new Date().toLocaleDateString()}</p>
            
            <div class="score">
                <div class="score-value">${score}%</div>
                <p><strong>Readiness Score</strong></p>
                <p>${scoreMessage}</p>
            </div>
            
            <h2>Project Overview</h2>
            <p><strong>Title:</strong> ${projectData.projectTitle || "Not specified"}</p>
            <p><strong>Description:</strong> ${projectData.projectDescription || "Not specified"}</p>
            
            <h2>Key Stakeholders</h2>
            ${
              projectData.stakeholders && projectData.stakeholders.length > 0
                ? `<ul>${projectData.stakeholders.map((s) => `<li><strong>${s.name}</strong> - ${s.role}</li>`).join("")}</ul>`
                : "<p>No stakeholders specified</p>"
            }
            
            <h2>Goals & Success Criteria</h2>
            ${
              projectData.goals && projectData.goals.length > 0
                ? `<ul>${projectData.goals.map((g) => `<li>${g}</li>`).join("")}</ul>`
                : "<p>No goals specified</p>"
            }
            <p><strong>Success Criteria:</strong> ${projectData.successCriteria || "Not specified"}</p>
            
            <h2>Timeline</h2>
            <p><strong>Start Date:</strong> ${projectData.startDate ? new Date(projectData.startDate).toLocaleDateString() : "Not specified"}</p>
            <p><strong>End Date:</strong> ${projectData.endDate ? new Date(projectData.endDate).toLocaleDateString() : "Not specified"}</p>
            ${
              projectData.milestones && projectData.milestones.length > 0
                ? `<p><strong>Milestones:</strong></p><ul>${projectData.milestones.map((m) => `<li>${m.milestone} - ${new Date(m.date).toLocaleDateString()}</li>`).join("")}</ul>`
                : "<p>No milestones specified</p>"
            }
            
            <h2>Responsibilities</h2>
            ${
              projectData.responsibilities && projectData.responsibilities.length > 0
                ? `<ul>${projectData.responsibilities.map((r) => `<li><strong>${r.task}</strong> - ${r.assignee}</li>`).join("")}</ul>`
                : "<p>No responsibilities specified</p>"
            }
            
            <h2>Dependencies & Risks</h2>
            <p><strong>Dependencies:</strong> ${projectData.dependencies || "None specified"}</p>
            <p><strong>Risks:</strong> ${projectData.risks || "None specified"}</p>
        </body>
        </html>
    `
}

// Utility functions
function startOver() {
  if (confirm("Are you sure you want to start over? All current data will be lost.")) {
    sessionStorage.removeItem("projectScopeData")
    location.reload()
  }
}

function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Style the notification
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background = "#2ecc71"
      break
    case "error":
      notification.style.background = "#e74c3c"
      break
    case "info":
    default:
      notification.style.background = "#4f8a8b"
      break
  }

  // Add to document
  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// Add CSS animations for notifications
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)
