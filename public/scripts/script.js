document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("messages");
    const ps = new PerfectScrollbar(container, {
      wheelSpeed: 2,
      wheelPropagation: true,
      minScrollbarLength: 20,
    });
  });
  document.addEventListener("DOMContentLoaded", function () {
    const ws = new WebSocket("ws://localhost:3000");
    const sendImageButton = document.getElementById("sendImageButton");
    const cancelImageButton = document.getElementById("cancelImageButton");
    const sendFileButton = document.getElementById("sendFileButton");
    const cancelFileButton = document.getElementById("cancelFileButton");
    const messagesContainer = document.getElementById("messages");
    const nameInput = document.getElementById("name");
    const nameInputArea = document.getElementById("nameInputArea");
    const messageInput = document.getElementById("message");
    const sendButton = document.getElementById("sendButton");
    const fileInput = document.getElementById("fileInput");
    const uploadButton = document.getElementById("uploadButton");
    const imageModal = document.getElementById("imageModal");
    const fileModal = document.getElementById("fileModal");
    const overlay = document.querySelector(".overlay");

    sendImageButton.addEventListener("click", sendImage);
    cancelImageButton.addEventListener("click", closeModal);

    sendFileButton.addEventListener("click", sendFile);
    cancelFileButton.addEventListener("click", closeModal);

    let currentFile;

    if (localStorage.getItem("chatName")) {
      nameInput.value = localStorage.getItem("chatName");
      nameInputArea.style.display = "none";
      messageInput.disabled = false;
      sendButton.disabled = false;
      fileInput.disabled = false;
      uploadButton.disabled = false;
    }

    sendButton.addEventListener("click", function () {
      const message = messageInput.value;
      if (nameInput.value && message.trim() !== "") {
        const msgData = { name: nameInput.value, message: message };
        ws.send(JSON.stringify(msgData));
        messageInput.value = "";
      }
    });

    uploadButton.addEventListener("click", function () {
      fileInput.click();
    });

    fileInput.addEventListener("change", function () {
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        currentFile = file;
        if (file.type.startsWith("image/")) {
          openImageModal(file);
        } else {
          openFileModal(file);
        }
      }
    });

    function openImageModal(file) {
      var reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("previewImage").src = e.target.result;
        imageModal.style.display = "block";
        overlay.style.display = "block";
      };
      reader.readAsDataURL(file);
    }

    function openFileModal(file) {
      document.getElementById("fileName").textContent = file.name;
      fileModal.style.display = "block";
      overlay.style.display = "block";
    }

    function closeModal() {
      document.getElementById("imageModal").style.display = "none";
      document.getElementById("fileModal").style.display = "none";
      document.querySelector(".overlay").style.display = "none";
      document.getElementById("previewImage").src = "";
      document.getElementById("imageCaption").value = "";
    }

    function displayMessage(
        username,
        message,
        side,
        caption = "",
        type = ""
    ) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message " + side;
    
        // Nome do usuário
        const nameSpan = document.createElement("span");
        nameSpan.className = "message-name";
        nameSpan.textContent = username;
        msgDiv.appendChild(nameSpan);
        msgDiv.appendChild(document.createElement("br"));
    
        if (type === "image") {
            const imageElement = document.createElement("img");
            imageElement.src = message;
            imageElement.style.maxWidth = "100%";
            msgDiv.appendChild(imageElement);
    
            if (caption) {
                const captionDiv = document.createElement("div");
                captionDiv.className = "image-caption";
                captionDiv.innerHTML = linkify(caption); // Use linkify to make URLs clickable in the caption as well
                msgDiv.appendChild(document.createElement("br"));
                msgDiv.appendChild(captionDiv);
            }
        } else if (type === "file") {
            const fileLink = document.createElement("a");
            fileLink.href = message;
            fileLink.textContent = "Download " + message.split("/").pop();
            fileLink.download = "";
            msgDiv.appendChild(fileLink);
        } else {
            const contentSpan = document.createElement("span");
            contentSpan.innerHTML = linkify(message); // Transform URLs to clickable links
            msgDiv.appendChild(contentSpan);
        }
    
        document.getElementById('messages').appendChild(msgDiv);
        document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
    }
    
    function linkify(inputText) {
        var replacedText, replacePattern1, replacePattern2, replacePattern3;
    
        // URLs starting with http://, https://, or ftp://
        replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
    
        // URLs starting with "www." (without // before it, or it'd re-link the ones done above).
        replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
    
        // Change email addresses to mailto:: links.
        replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
        replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
    
        return replacedText;
    }
    

    function sendImage() {
      const caption = document.getElementById("imageCaption").value;
      const formData = new FormData();
      formData.append("file", currentFile);
      formData.append("name", nameInput.value);
      formData.append("caption", caption);
      formData.append("type", "image"); // Indica que o conteúdo é uma imagem

      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const imageUrl = data.filePath; // Caminho do servidor onde a imagem foi salva
          displayMessage(
            nameInput.value,
            imageUrl,
            "right",
            caption,
            "image"
          );
          closeModal();
        });
    }

    function sendFile() {
      const formData = new FormData();
      formData.append("file", currentFile);
      formData.append("name", nameInput.value);

      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          closeModal();
          fileInput.value = "";
        });
    }

    ws.onmessage = function (event) {
      const newMessages = JSON.parse(event.data);
      newMessages.forEach((msg) => {
        const displaySide = msg.name === nameInput.value ? "right" : "left";
        displayMessage(
          msg.name,
          msg.message,
          displaySide,
          msg.caption,
          msg.type
        );
      });
    };

    document
      .getElementById("setName")
      .addEventListener("click", function () {
        if (nameInput.value.trim() !== "") {
          localStorage.setItem("chatName", nameInput.value);
          nameInputArea.style.display = "none";
          messageInput.disabled = false;
          sendButton.disabled = false;
          fileInput.disabled = false;
          uploadButton.disabled = false;
        }
      });
  });