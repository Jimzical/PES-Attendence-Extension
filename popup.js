document.addEventListener("DOMContentLoaded", function () {
  const dataContainer = document.getElementById("dataContainer");

  // Request data from content script when popup is opened
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "readTable" });
  });

  // Listen for data from content script
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === "tableData") {
      const data = request.data;

      
      let html = "";
      if (data.length === 0) {
        html += `
        <div class="alert alert-primary text-center" role="alert">Please go to the Attendence Page on <a href="https://www.pesuacademy.com/" class="text-primary fw-bold" target="_blank">PESU Academy</a> and try again</div>
        `;
        dataContainer.innerHTML = html;
        return;
      }

      html += `<table class= "table table-hover table-dark table-bordered">`;
      html += `
                <thead>
                <tr>
                <th class="text-center">Course Name</th>
                <th class="text-center">Status</th>
                </tr>
                </thead>
                <tbody>      
          `
      const target = 0.8;
      
  

      data.forEach(item => {

        let classAttended = item.AttendedClasses;
        let totalClass = item.TotalClasses;
        let needClassCounter = 0;
        let message = "";
        // if classAttened not NA or null
        if (classAttended) {
          // if classAttended/totalClass is less than target
          if (classAttended/totalClass < target) {
            while (classAttended/totalClass <= target) {
              classAttended++;
              totalClass++;
              needClassCounter++;
            }
            message = `Need ${needClassCounter} Classes to Attend to Reach ${target * 100}%`;
          }
          else {
            while (classAttended/totalClass > target) {
              totalClass++;
              needClassCounter++;
            }
            message = `Can Miss ${needClassCounter} Classes to Reach ${target * 100}%`;
          }
        }
        else {
          message = "No Data Available";
        }
      
        html += `
                <tr>
                <th scope="row" >${item.CourseName}</th>
                <td>${message}</td>
                </tr>

                `;
      });
      
      html += `</tbody></table>`;
      dataContainer.innerHTML = html;
    }
  });
});
