document.addEventListener("DOMContentLoaded", function () {
  // ---------- Login Logic ----------
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const errorEl = document.getElementById("error");

      const validJudges = {
        judge1: "pass1",
        judge2: "pass2",
        judge3: "pass3",
        judge4: "pass4"
      };

      if (validJudges[username] === password) {
        localStorage.setItem("loggedInJudge", username);
        window.location.href = "grading.html";
      } else {
        errorEl.textContent = "Invalid username or password.";
      }
    });
  }

  // ---------- Grading Form Logic ----------
  if (window.location.pathname.includes("grading.html")) {
    const judge = localStorage.getItem("loggedInJudge") || "Unknown";
    const judgeNameInput = document.getElementById("judgeName");
    if (judgeNameInput) judgeNameInput.value = judge;

    const form = document.getElementById("gradingForm");
    const totalField = document.getElementById("totalScore");
    const successMsg = document.getElementById("success");

    // Define both developing and accomplished field IDs
    const criteriaPairs = [
      ["criteria1", "criteria1b"],
      ["criteria2", "criteria2b"],
      ["criteria3", "criteria3b"],
      ["criteria4", "criteria4b"]
    ];

    // Recalculate total if any input changes
    criteriaPairs.forEach(([low, high]) => {
      const lowEl = document.getElementById(low);
      const highEl = document.getElementById(high);

      if (lowEl) lowEl.addEventListener("input", updateTotal);
      if (highEl) highEl.addEventListener("input", updateTotal);
    });

    function updateTotal() {
      let total = 0;
      criteriaPairs.forEach(([low, high]) => {
        const lowVal = parseInt(document.getElementById(low).value) || 0;
        const highVal = parseInt(document.getElementById(high).value) || 0;

        // Use whichever value is greater (assuming one is filled)
        total += Math.max(lowVal, highVal);
      });

      totalField.value = total;
    }

    // Form submission
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const group = document.getElementById("groupNumber").value.trim();
        const entry = {
          judge: judge,
          groupMembers: document.getElementById("groupMembers").value.trim(),
          projectTitle: document.getElementById("projectTitle").value.trim(),
          total: parseInt(totalField.value),
          comments: document.getElementById("comments").value.trim(),
        };

        const key = `grades_group_${group}_judge_${judge}`;
        localStorage.setItem(key, JSON.stringify(entry));

        successMsg.textContent = "Grades submitted successfully!";
        form.reset();
        totalField.value = "";
        if (judgeNameInput) judgeNameInput.value = judge;
      });
    }
  }
});
