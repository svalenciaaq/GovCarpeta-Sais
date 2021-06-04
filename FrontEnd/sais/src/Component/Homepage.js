import React, {Component} from "react";
import { Form, CardBody, Card, Input, Button, Alert  } from 'reactstrap';
import { services } from "../Services";
import { Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DragAndDrop from "./DragAndDrop";


class Homepage extends Component {

    constructor(props){
        super(props);
        this.state = {
            content: [],
            uploadmsg: "",
            selectedFiles: [],
            uploadFile: false
        };
        this.logoff = this.logoff.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.onChangeFileHandler = this.onChangeFileHandler.bind(this);
        this.checkDuplicates = this.checkDuplicates.bind(this);
        this.uploadFile =  this.uploadFile.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    
    toggle(){
        const {uploadFile} = this.state;
        this.setState({
            uploadFile: !uploadFile
        })
    }

    handleDrop = (files) => {
        let fileList = this.state.selectedFiles;
        let filesArray = Array.from(files);
        for (let key in filesArray) {
            if (this.checkDuplicates(filesArray[key], fileList)) {
            fileList.push(filesArray[key]);
            }
        }
        this.setState({
            selectedFiles: fileList,
        })
    };

    onChangeFileHandler = event => {
        let files = event.target.files;
        let fileList = this.state.selectedFiles;
        let message = [];
        let filesArray = Array.from(files);
        for (let key in filesArray) {
          if (this.checkDuplicates(filesArray[key], fileList)) {
            fileList.push(filesArray[key]);
            message.push("");
          }
        }
        this.setState({
          selectedFiles: fileList,
          message: message
        })
    };

    checkDuplicates(file, fileList) {
        for (let x = 0; x < fileList.length; x++) {
            if (fileList[x].name === file.name) {
                this.setState({
                    generalError: "Some duplicate files could not be accepted."
                });
                setTimeout(this.cleanGeneralError, 4000);
                return false;
            }
        }
        return true;
    }

    logoff(){
        sessionStorage.removeItem("jwt");
        this.props.history.push("/login");
    }

    uploadFile(){
        let {selectedFiles} = this.state;
        if(selectedFiles && selectedFiles[0]){
            services.uploadFile(selectedFiles[0].name, selectedFiles[0]).then(data => {

            });
        }
    }

    componentDidMount(){
        var jwt = sessionStorage.getItem('jwt');
        if(!jwt){
            this.props.history.push("/login");
        }else{
            services.getFileList().then(data => {
                if(data.content){
                    this.setState({content: data.content});
                }
            });
        }
    }

    render(){
        const {content, uploadFile, uploadmsg, selectedFiles} = this.state;
        let fileList = [];
        let tableContent = [];
        
        for(let key in content){
            tableContent.push(
                <tr>
                    <th scope="row">{content[key]}</th>
                </tr>
            );
        }

        if (selectedFiles.length > 0) {
            for (let key in selectedFiles) {
              fileList.push(
                <li className="form-control list-group-item" style={{display: '-webkit-inline-box'}} key={key}>
                    <p>{selectedFiles[key].name}</p>
                </li>
              );
            }
          }

        return(
            <div>
                <div>
                    <Button color="warning" className={"m-4"} onClick={this.toggle}>Upload File</Button>
                </div>
                <div style={{
                    display: "block", 
                    justifyContent:"center",
                    alignItems:"center",
                    minWidth:'400px',
                    maxHeight:'700px',
                    height:'700px',
                    margin: '90px',
                }} className="mt-auto">
                    <Card>
                        <CardBody>
                            <Table responsive={true}>
                                <thead>
                                    <tr>
                                        <th>Filename</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableContent}
                                </tbody>
                            </Table>
                            <Button color="warning" onClick={this.logoff} type="submit" className='mt-4' style={{width: '100%'}}>Log off</Button>
                        </CardBody>
                    </Card>
                </div>
                <Modal isOpen={uploadFile} toggle={this.toggle}>
                <DragAndDrop handleDrop={this.handleDrop}>
                    <ModalHeader toggle={this.toggle}>Upload file</ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <label htmlFor="files" className="btn btn-block btn-dark">Choose your file(s) </label>
                            <input type="file" id="files" hidden={true} className="form-control"
                                onChange={this.onChangeFileHandler}/>
                            <div className="offset-md-3 col-md-6 text-center">
                                {uploadmsg}
                            </div>
                            {selectedFiles && selectedFiles.length > 0 ?
                                <div className="card col-12 mt-5 mb-5">
                                    <div className="card-header">Files</div>
                                    <ul className="list-group list-group-flush">
                                    {fileList}
                                    </ul>
                                </div> : ""}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.uploadFile}>Upload</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                    </DragAndDrop>
                </Modal>
            </div>
        );
    }

}

export default Homepage;