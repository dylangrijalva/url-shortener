const urlInput = document.querySelector('.input-url');
const urlIdentifierInput = document.querySelector('.input-url-identifier');
const createButton = document.querySelector('.button-create');
const displayUrlInput = document.querySelector('.display-url');

const clearForms = () => {
    urlInput.value = '';
    urlIdentifierInput.value = '';    
}

clearForms();

const createUrl = async (url, urlIdentifier) => {
    const response = await fetch('/url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url,
            urlIdentifier
        })
    });
    
    return await response.json();
}

createButton.addEventListener('click', async () => {
    const url = urlInput.value;
    const urlIdentifier = urlIdentifierInput.value;

    const result = await createUrl(url, urlIdentifier);
    console.log(result);
    displayUrlInput.innerHTML = result.toString();
    clearForms();
});