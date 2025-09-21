import { RuntimeVal } from "./values";

export default class Environment {

    private parent?: Environment;
    private varibles: Map<string, RuntimeVal>

    constructor(parentENV?: Environment){
        this.parent = parentENV;
        this.varibles = new Map();
    }
    public declareVarible (varname: string, value: RuntimeVal): RuntimeVal{
        if (this.varibles.has(varname)){
            throw `cannot declare vaiable ${varname} as it already in use`;
        }
        this.varibles.set(varname, value)
        return value
    }
    public assignVarible(varname: string, value: RuntimeVal): RuntimeVal{
        const environment = this.resolve(varname);
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