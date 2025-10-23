import { RuntimeVal } from "./values";

export default class Environment {

    private parent?: Environment;
    private varibles: Map<string, RuntimeVal>
    private constant: Set<string>;
    constructor(parentENV?: Environment){
        this.parent = parentENV;
        this.varibles = new Map();
        this.constant = new Set();
    }
    public declareVarible (varname: string, value: RuntimeVal, constant: boolean): RuntimeVal{
        console.log(varname, "varname", value, "value")
        if (this.varibles.has(varname)){
            throw `cannot declare vaiable ${varname} as it already in use`;
        }
        this.varibles.set(varname, value)
        if (constant){
             this.constant.add(varname);
        }
        return value
    }
    public assignVarible(varname: string, value: RuntimeVal): RuntimeVal{
        const environment = this.resolve(varname);
        if (environment.constant.has(varname)) {
            throw `cannot reasign to variable ${varname} as it was declared constant`
        }
        environment.varibles.set(varname, value);
        return value
    }   
    public lookupVarible(varname: string): RuntimeVal{
        const environment = this.resolve(varname)
        return environment.varibles.get(varname) as RuntimeVal 
    }
    public resolve(varname: string): Environment{
        if (this.varibles.has(varname)){    
        return this;
        }
        if (this.parent == undefined){
            throw `connot resolve ${varname} as it does not exist`
        }
        return this.parent.resolve(varname);
    }
}