function htmlTableToTable(tableHTML) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(tableHTML, "text/html");

	const table = doc.querySelector("table");
	const rows = table.querySelectorAll("tbody tr");

	let PesVerifier = "";

	if (document.querySelector('div.table-responsive#studentAttendanceSemester')) {
		PesVerifier = "true";
	  } else {
		PesVerifier = "false";
	}

	const data = [];

	rows.forEach(row => {
		const columns = row.querySelectorAll("td");
		const courseName = columns[1].textContent;
		const attendedClasses = parseInt(columns[2].textContent.split("/")[0], 10); // Parse as integer
		const totalClasses = parseInt(columns[2].textContent.split("/")[1], 10); // Parse as integer

		const percentage = parseInt(columns[3].textContent, 10); // Parse as integer

		data.push({
			CourseName: courseName,
			TotalClasses: totalClasses,
			AttendedClasses: attendedClasses,
			Percentage: percentage,
			test: columns[2].textContent,
			PesVerifier: PesVerifier,
		});
	});

	return data;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "readTable") {
		const tables = document.getElementsByTagName("table");
		let data = [];

		if (tables.length === 0) {
			// data.push({ PesVerifier: "false" });
			chrome.runtime.sendMessage({ type: "tableData", data: data });
			return;
		}

		if (document.querySelector('div.table-responsive#studentAttendanceSemester')) {
			console.log("Trying to find the element.");
			for (let table of tables) {
				const tableHTML = table.outerHTML;
				data = data.concat(htmlTableToTable(tableHTML));
			}
			console.log(data);
	
			// Send the data to the background script
			chrome.runtime.sendMessage({ type: "tableData", data: data });
	
		} 
		else {
			chrome.runtime.sendMessage({ type: "tableData", data: data });

		}

	}
});
