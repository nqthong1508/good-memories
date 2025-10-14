// ====== DỮ LIỆU ẢNH & VIDEO ======
const albums = [
  {
    title: "Family Photos 👨‍👩‍👧",
    cover: "https://picsum.photos/id/1018/300/200",
    folderId: "1E4EZFzkcIR5GwhBa-oioKLHS4ex_2qWb"    
  },
  {
    title: "Friends Photos ",
    cover: "https://picsum.photos/id/1005/300/200",
    photos: [
      "https://picsum.photos/id/1005/800/600",
      "https://picsum.photos/id/1006/800/600",
      "https://picsum.photos/id/1008/800/600"
    ]
  }
];

const driveVideos = [
  { id: "1vgtOEN5IXvV18XoiUJpPYk_xFbaknrts", title: "My son 🎥" }
];

const youtubeVideos = [
  { id: "YbJOTdZBX1g", title: "YouTube Demo ❤️" }
];

// ====== HELPER FUNCTIONS ======
const driveView = id => `https://drive.google.com/uc?export=view&id=${id}`;
const driveDownload = id => `https://drive.google.com/uc?export=download&id=${id}`;

// ====== HIỂN THỊ GALLERY ======
function renderGallery() {
  const grid = document.getElementById("galleryGrid");
  grid.innerHTML = "";

  albums.forEach((album, albumIndex) => {
    const card = document.createElement("div");
    card.className = "album-card";

    // Ảnh đại diện (cover)
    const img = document.createElement("img");
    if (album.cover.startsWith("http")) {
      img.src = album.cover;
    } else {
      img.src = `https://drive.google.com/uc?export=view&id=${album.cover}`;
    }
    img.alt = album.title;
    img.className = "album-cover";

    // Tên album (hiển thị dưới)
    const caption = document.createElement("div");
    caption.className = "album-title";
    caption.textContent = album.title;

    card.appendChild(img);
    card.appendChild(caption);
    grid.appendChild(card);

    // Click để mở slideshow
    card.onclick = () => openAlbum(albumIndex);
  });
}

// ====== MODAL SLIDESHOW ======
let currentAlbumIndex = 0;
let currentPhotoIndex = 0;

async function openAlbum(albumIndex) {
  currentAlbumIndex = albumIndex;
  const album = albums[albumIndex];

  if (album.folderId && (!album.photos || album.photos.length === 0)) {
  const scriptURL = "https://script.google.com/macros/s/AKfycbz42E1cZ1Bs6ZmFqxttewp28Qx4Da_ZKZzzbUQGTWuSHmiUsYomqvzMY6H3M4WpsCkR/exec";
  try {
    const res = await fetch(`${scriptURL}?id=${album.folderId}`);
    const data = await res.json();
    console.log("Fetched data:", data);
    // Map only the link field (pure string URLs)
    album.photos = data.map(f => f.link.trim());
    console.log("album.photos now:", album.photos);
  } catch (err) {
    console.error("Error fetching from Apps Script:", err);
    album.photos = [];
  }
}

  showModal();
  showImageInModal();
}

function showImageInModal() {
  const album = albums[currentAlbumIndex];
  const modalBody = document.getElementById("modalBody");

  if (!album || album.photos.length === 0) {
    modalBody.innerHTML = "<p>Album này chưa có hình nào.</p>";
    return;
  }

  const currentId = album.photos[currentPhotoIndex];
  let imgUrl = "";

  // Cho phép ảnh public từ Drive hoặc URL trực tiếp (như picsum.photos)
  if (currentId.startsWith("http")) {
    imgUrl = currentId;
  } else {
    imgUrl = `https://drive.google.com/uc?export=view&id=${currentId}`;
  }

  modalBody.innerHTML = `
    <h3 style="text-align:center">${album.title}</h3>
    <div class="slideshow">
      <button id="prevBtn" class="nav-btn">❮</button>
      <img id="slideImg" src="${imgUrl}" alt="Ảnh ${currentPhotoIndex + 1}" 
        onerror="this.src='https://picsum.photos/800/600?blur=3'; this.alt='Ảnh không hiển thị';">
      <button id="nextBtn" class="nav-btn">❯</button>
    </div>
    <p class="slide-count">${currentPhotoIndex + 1} / ${album.photos.length}</p>
  `;

  document.getElementById("prevBtn").onclick = () => changePhoto(-1);
  document.getElementById("nextBtn").onclick = () => changePhoto(1);
}

function changePhoto(direction) {
  const album = albums[currentAlbumIndex];
  currentPhotoIndex += direction;
  if (currentPhotoIndex < 0) currentPhotoIndex = album.photos.length - 1;
  if (currentPhotoIndex >= album.photos.length) currentPhotoIndex = 0;
  showImageInModal();
}

// ====== MODAL CONTROL ======
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");

function showModal() {
  modal.style.display = "flex";
}
function closeModal() {
  modal.style.display = "none";
}

modalClose.onclick = closeModal;
modal.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

// ====== VIDEOS ======
function renderVideos() {
  const driveDiv = document.getElementById("driveVideos");
  const ytDiv = document.getElementById("youtubeVideos");

  driveDiv.innerHTML = "";
  ytDiv.innerHTML = "";

  // ===== Video từ Google Drive (embed preview) =====
  driveVideos.forEach(v => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <iframe src="https://drive.google.com/file/d/${v.id}/preview"
              allow="autoplay"
              allowfullscreen></iframe>
      <div class="caption">${v.title}</div>
    `;
    driveDiv.appendChild(card);
  });

  // ===== Video từ YouTube =====
  youtubeVideos.forEach(v => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${v.id}" allowfullscreen></iframe>
      <div class="caption">${v.title}</div>
    `;
    ytDiv.appendChild(card);
  });
}

// ====== NAVIGATION (ẩn/hiện section & hero) ======
const hero = document.getElementById("hero");
const sections = document.querySelectorAll(".panel");
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.getAttribute("href").replace("#", "");
    navLinks.forEach(a => a.classList.remove("active"));
    link.classList.add("active");

    if (target === "home") {
      hero.style.display = "";
      sections.forEach(s => (s.classList.toggle("active", s.id === "home")));
    } else {
      hero.style.display = "none";
      sections.forEach(s => (s.classList.toggle("active", s.id === target)));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// ====== INIT ======
renderGallery();
renderVideos();
