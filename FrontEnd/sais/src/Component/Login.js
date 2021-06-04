import React, {Component} from "react";
import {
    Card, CardBody, CardText, Button
  } from 'reactstrap';
  import { Form, FormGroup, Label, Input, FormFeedback, Alert  } from 'reactstrap';
  import services from '../Services/services'

class Login extends Component {

    constructor(props){
        super(props);
        this.state = {
            email: "",
            password: "",

            errorLogin: false
        };
        this.changeInputValue = this.changeInputValue.bind(this);
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
    }

    changeInputValue(event){
        const target = event.target;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    register(){
        this.props.history.push("/register");    
    }

    login(){
        const {email, password} = this.state;
        services.login(email, password).then(data => {
            if(data.msg.includes("successful")){
                this.setState({
                    errorLogin: false
                });
                sessionStorage.setItem('jwt', data.token);
                this.props.history.push("/");
            }else{
                this.setState({
                    errorLogin: true
                });
            }
        });
    }

    render(){
        const {email, password, errorLogin} = this.state;
        return(
            <div style={{
                display: "flex", 
                justifyContent:"center",
                alignItems:"center",
                width:'400px',
                height:'700px', 
                margin: 'auto'
            }}>
                <Card>
                    <CardBody>
                        <Form>
                            {errorLogin ? 
                                <Alert  color="danger">
                                    usuario o contraseña incorrectos
                                </Alert >
                                : 
                                ""
                            }
                            <FormGroup className='mb-2'  id="formGroupEmail">
                                <Label for="loginEmail" className='mb-2' style={{minWidth: '400px'}}>Email</Label>
                                <Input 
                                    type="text" 
                                    name="email" 
                                    id="loginEmail" 
                                    placeholder="Ingrese el correo" 
                                    value={email} 
                                    onChange={(e) => {this.changeInputValue(e)}}>
                                </Input>
                            </FormGroup>
                            <FormGroup className='mb-2' id="formGroupContraseña">
                                <Label for="registerPassword" className='mb-2'>Contraseña</Label>
                                <Input 
                                    type="password" 
                                    name="password" 
                                    placeholder="Ingrese la contraseña" 
                                    id="registerPassword" 
                                    value={password}
                                    onChange={(e) => {this.changeInputValue(e)}}/>
                            </FormGroup>
                        </Form>
                        <Button color="warning" onClick={this.login} type="submit" className='mt-4' style={{width: '100%'}}>Entrar</Button>
                        <Button color="orange" onClick={this.register} className='mt-4' style={{width: '100%'}}>Registrar</Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

}

export default Login;
