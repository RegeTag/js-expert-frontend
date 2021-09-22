export default class ViewManager{
  constructor(){
    this.tbody = document.getElementById("tbody");
    this.newFileButton = document.getElementById("newFileButton");
    this.fileElem = document.getElementById("fileElem");
    this.progressModal = document.getElementById("progress-modal");
    this.progressBar = document.getElementById("progress-bar");
    this.output = document.getElementById("output");
    this.modalInstance = {};

    this.formatter = new Intl.DateTimeFormat("pt", { 
      locale:"pt-bt",
      month:"long",
      day:"numeric",
      year:"numeric",
      hour:"2-digit",
      minute:"2-digit"
    });

  }

  configureModal(){
    this.modalInstance = M.Modal.init(this.progressModal, {
      opacity: 0,
      dismissable: false,

      //Possibilita clicar na tela com o modal aberto
      onOpenEnd(){
        this.$overlay[0].remove();
      }
    });
  }

  openModal(){
    this.modalInstance.open();
  }

  closeModal(){
    this.modalInstance.close();
  }

  updateStatus(size){
    this.output.innerHTML = `Uploading in <b>${Math.floor(size)}%</b>`;
    this.progressBar.value = size;
  }

  configureOnFileChange(fn){
    this.fileElem.onchange = e => fn(e.target.files);
  }

  configureButtonClick(){
    this.newFileButton.onclick = () => this.fileElem.click();
  }

  getIcon(file){
    const icon = file.match(/\.mp4/i) ? "movie" 
      : file.match(/\.jp|.png/i) ? "image" 
        : "content_copy";

    return icon;
  }

  makeIcon(file){
    const icon = this.getIcon(file);
    const colors = {
      image:"yellow600",
      movie:"red600",
      file: ""
    };

    return `<i class="material-icons ${colors[icon]} left">${icon}</i>`;
  }

  updateCurrentFiles(files){
    const filesList = files.map( item => {

      const fileHTML = `
        <tr>
          <td>${this.makeIcon(item.file)} ${item.file}</td>
          <td>${item.owner}</td>
          <td>${this.formatter.format(new Date(item.lastModified))}</td>
          <td>${item.size}</td>
        </tr>
      `;
      
      return fileHTML;
    });

    this.tbody.innerHTML = filesList.join("");
  }
}