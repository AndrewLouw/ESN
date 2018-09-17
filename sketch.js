let total=1000;
let connections = 10;
let logsize=500;
let neuronstracking=100;

let counter = 0;

let neurons = new Array(total);
let lastfires = new Array(total).fill(new Date());
let previousfires= new Array(total);
let threshold = 0;
let refractory = 100
let end = false;
let clock;

function setup() {
  neurons = neurons.fill().map((x,i) => new neuron(i,total,connections));
  neurons.forEach(neuron => {
    neuron.weights.forEach((weight,index)=>{
      neuron.weights[index]=weight*neurons[neuron.inputs[index]].sign;
    });
  });
  previousfires=lastfires.slice();
  neurons.forEach((neuron,index) => neuron.inputs.forEach(input => neurons[input].outputs.push(index)));
  for(i=0;i<total;i++){updatefire(i,lastfires[i])};
  createCanvas(logsize,total);
  clock=new Date();
}

function draw() {
  if(counter>=logsize){
    let time = new Date();
    console.log(time-clock)
    counter=0;
    let changed =0;
    neurons.forEach(neuron => {
      neuron.weights.forEach((weight,index)=>{
        let factor = 100;
        if(neuron.weights[index]>0) neuron.weights[index] = Math.max(weight-factor/(time-clock),0);
        else neuron.weights[index] = Math.min(weight+factor/(time-clock),0);
        //console.log(neuron.weights[index])
      })
      neuron.weights.forEach((weight,index)=>{
        let factor = 10000;
        if(neuron.weights[index]>0) neuron.weights[index] = weight+(factor/(time-clock))*neuron.firecounter[index];
        else if(neuron.weights[index]<0) neuron.weights[index] = weight-(factor/(time-clock))*neuron.firecounter[index];
        else{
          changed++
          neurons[neuron.inputs[index]].outputs = removeone(neurons[neuron.inputs[index]].outputs,neuron.index);
          neuron.inputs[index] = unique(neuron.inputs,total,index);
          neuron.weights[index] = Math.random()*neurons[neuron.inputs[index]].sign;
          neuron.delays[index] = 100*random();
        }
      })
      neuron.firecounter.fill(0);
    })
    console.log(changed)
    clock = new Date();
  }
  for(let index=0;index<neuronstracking;index++){
    if(previousfires[index]!=lastfires[index]) stroke(0);
    else stroke(200);
    point(counter,index);
  }
/*
  if(Math.random()<0.1){
    for (let i=0;i<total;i++){
      updatefire(i,lastfires[i]);
    }
  };
*/
  previousfires=lastfires.slice();
  counter++;
}

function update(index,time,source){
  let num = neurons[index].weights.reduce((a,x)=>a+x)+threshold;
  let denom = neurons[index].weights.reduce((a,x,i)=>a+Math.exp((time-neurons[index].lastfires[i])/1000*x));
  let frac=num/denom;
  if(frac>0 && denom !=0){
    let delay = -Math.log(frac);
    if(delay>0 && delay<1000000) setTimeout(updatefire(index,lastfires[index],source),delay);
  };
};

function updatefire(source,time,cause){
    if(lastfires[source]==time) {
      lastfires[source]=new Date();
      if(cause && neurons[source].inputs.indexOf(cause)!=-1){
        neurons[source].firecounter[neurons[source].inputs.indexOf(cause)]++;
        //console.log(neurons[source].inputs.indexOf(cause))
      }
      neurons[source].outputs.forEach( output =>{
        let index =neurons[output].inputs.indexOf(source)
        setTimeout(()=>{
          time=new Date();
          neurons[output].lastfires[index] = time;
          update(output,time,source);
          },neurons[output].delays[index]);  
      });
    };
};

function removeone(arr,value){
  let temp = new Array
  arr.forEach(element => {if(element!=value) temp.push(element)})
  return temp
};