import React, {Component} from "react";
import services from '../Services/services'

class Root extends Component {

    constructor(props){
        super(props);
        this.state = {

        };
    }

    componentDidMount(){
        var jwt = sessionStorage.getItem('jwt');

        if(jwt){
            this.props.history.push("/homepage");
        }else{
            this.props.history.push("/login");
        }
    }

    render(){
        return(
            <div style={{
                display: "flex", 
                justifyContent:"center",
                alignItems:"center",
                minWidth:'400px',
                height:'700px',
                margin: 'auto'
            }}>
                
            </div>
        );
    }

}

export default Root;