<script>
  import { insertDataToDatabase } from "$lib/index.js";

  let csvData = null;
  let dataArray = null;
  let userDataArray = null;

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const contents = e.target.result;
      csvData = contents;
    };

    reader.readAsText(file);
  };

  const convertCSVToArray = () => {
    if (csvData) {
      const rows = csvData.split("\n");
      dataArray = rows.map((row) => row.split(","));
      console.log(dataArray);
    } else {
      console.log(csvData);
      console.log("No CSV data available.");
    }
    return dataArray;
  };

  const makeid = (length) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  const createUserDataArray = () => {
    if (!dataArray) {
      console.log("CSV data is not available.");
      return;
    }

    userDataArray = dataArray.slice(1).map((data) => {
      // Skipping the header row
      const [, , , name, email] = data; // Extracting name and email from each row
      return {
        id: makeid(5),
        name,
        email,
      };
    });
    console.log(userDataArray);
  };

  const uploadUserDatabase = () => {
    if (!userDataArray) console.error("User data array is not available.");
    userDataArray.forEach((d) => {
      insertDataToDatabase(d.key, d.email, d.name, "asdf");
    });
  };
</script>

<div>
  <input type="file" accept=".csv" on:change={handleFileInputChange} />
  <button on:click={convertCSVToArray}>convertCSVToArray</button>
  <button on:click={createUserDataArray}>createUserDataArray</button>
  <button on:click={uploadUserDatabase}>uploadUserDatabase</button>
</div>
