export const saveJson = ({ json, filename }) => () => {
    console.log("saveJson", json)
    // Convert the JSON value to a JSON string
    const jsonData = JSON.stringify(json, null, 2)

    // Create a Blob object with the JSON data and type "application/json"
    const blob = new Blob([jsonData], { type: "application/json" })

    // Create a link element
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = filename

    // Simulate a click on the link to trigger download
    link.click()

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(link.href)
}

export const loadJson = ({ onLoad }) => () => {
    const button = document.createElement("button")
    button.textContent = "Upload File"

    const input = document.createElement("input")
    input.type = "file"
    input.style.display = "none"

    input.addEventListener("change", async (event) => {
        const target = event.target
        if (target.files && target.files[0]) {
            const file = target.files[0]
            if (file.type !== 'application/json') return
            const text = await file.text()
            const json = JSON.parse(text)
            onLoad(json)
        }
    })

    input.click()
}


export const getJsonFromChangeInputFile_ = ({ err, ok }) => ({ event }) => async () => {
    const uploadedFile = event.target.files[0]

    // Check if a file is actually uploaded
    if (uploadedFile) {
        const reader = new FileReader()

        try {
            const fileContent = await new Promise((resolve, reject) => {
                reader.onload = (e) => resolve(e.target.result)
                reader.onerror = (error) => reject(error)
                reader.readAsText(uploadedFile)
            })
            const jsonData = JSON.parse(fileContent)
            return ok(jsonData)
        } catch (err) {
            alert(`Error parsing input file: ${err.toString()}`)
            return err
        }
    }
}