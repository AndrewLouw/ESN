class neuron{
    constructor(index,total,connections,sign){
        this.index = index;
        this.inputs = new Array(connections).fill().map(()=>randint(total,index));
        for(let i=0;i<connections;i++){
            if(this.inputs.indexOf(this.inputs[i])!=i){
                this.inputs[i]=randint(total,index)
                i--
            }
        }
        this.delays = new Array(connections).fill().map(()=>100*random());
        this.weights = new Array(connections).fill().map(()=>random());
        this.sign = sign||randint([-1,2],0);
        this.outputs = new Array();
        this.lastfires =new Array(connections);
        this.firecounter = new Array(connections).fill(0);
    };
};

function randint(bounds,exclude){
    let max,min;
    if (bounds.length==2){
        min = bounds[0];
        max =bounds[1];
    }
    else {
        min =0;
        max = bounds;
    };
    let num= Math.floor(Math.random()*(max-min-(exclude!==undefined))+min);
    if (num>=exclude) num++;
    return num;
};

function unique(arr,total,exclude){
    let num = randint(total,exclude);
    if (arr.indexOf(num) == -1) return num
    else return unique(arr,total,exclude)
}

