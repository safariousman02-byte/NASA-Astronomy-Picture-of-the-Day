const api_key = 'DEMO_KEY';
const base_url = 'https://api.nasa.gov/planetary/apod';

let currentDate = new Date();

const content = document.getElementById('content');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

async function fetchApod(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const url = `${base_url}?api_key=${api_key}&date=${dateStr}`;

    try {
        const res = await fetch(url);

            if (!res.ok) {
                throw new Error("Failed to fetch");
                
            }

            return await res.json();

    }catch(err) {
        throw new Error("Network error, you need to check your internet connection!");
    }

}

function render(data) {

    if (data.error) {
        content.innerHTML = `<div class="error">${data.error}</div>`;
        return;
    }

    let mediaHtml = '';

        if (data.media_type === 'video') {
            mediaHtml = `<iframe src="${data.url}" alt="${data.title}"></iframe>`
        }else {
            mediaHtml = `<img src="${data.url}" alt="${data.title}" />`;
        }

    content.innerHTML = `
        <div class="image-wrapper">${mediaHtml}</div>
        <div class="title">${data.title}</div>
        <div class="date">${data.date}</div>
        <div class="explanation">${data.explanation}</div>
    `;

}

async function loadApod(date) {

    content.innerHTML = `<div class="loading">Loading...</div>`;

    try {
        const data = await fetchApod(date);
        render(data);
    } 
    catch(err) {
        content.innerHTML = `<div class="error">${err.message}</div>`;
    }

}

function changeDate(days) {

    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    currentDate = newDate;
    loadApod(currentDate);

}

prevBtn.addEventListener('click', () => changeDate(-1));
nextBtn.addEventListener('click', () => changeDate(1));

loadApod(currentDate);