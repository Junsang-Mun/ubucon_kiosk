<script>
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
    } else {
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
      const [
        ,
        ,
        ,
        name,
        email,
        ,
        org,
        ,
        ,
        ,
        ,
        ,
        teeSize,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
        ,
      ] = data;
      return {
        key: makeid(6),
        name,
        email,
        org,
        teeSize,
      };
    });
    console.log(userDataArray);
  };

  const checkIfKeyIsUnique = () => {
    const keys = userDataArray.map((data) => data.key);
    const uniqueKeys = new Set(keys);
    return keys.length === uniqueKeys.size;
  };

  const uploadUserDatabase = () => {
    if (!userDataArray) console.error("User data array is not available.");
    if (!checkIfKeyIsUnique()) {
      console.error("Key is not unique.");
      return;
    }
    userDataArray.forEach((d) => {
      const { key, name, email, org, teeSize } = d;
      const queryString = new URLSearchParams({
        key,
        name,
        email,
        org,
        teeSize,
      }).toString();
      if (name === undefined && email === undefined) return;
      fetch(`/initAttendee?${queryString}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    });
  };
</script>

<div class="container p-5 m-5">
  <input type="file" accept=".csv" on:change={handleFileInputChange} />
  <button on:click={convertCSVToArray}>convertCSVToArray</button>
  <button on:click={createUserDataArray}>createUserDataArray</button>
  <button on:click={uploadUserDatabase}>uploadUserDatabase</button>
</div>
