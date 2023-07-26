
//== Root Component ==========================================================

const RootComponent = {
  data: function() {
    return {
      flights: [],
      loading: true,
      error: false,
      range: { min: 50, max: 600 },
      thresholds: [0, 50, 100, 150, 200, 250, 300, 350,
        400, 450, 500, 550, 600, 650, 700, 750 ],
    }
  },
  mounted: function() {
    this.fetchFlights();
  },
  watch: {
    range: function() {
      this.fetchFlights();
    },
  },
  methods: {
    fetchFlights: function() {
      this.loading = true;
      fetch(`http://localhost:3000/flights/${this.range.min}/${this.range.max}`)
      .then(res => res.json())
      .then(json => {
        this.loading = false;
        if (Array.isArray(json)) {
          this.flights = json
          this.error = false;
        } else {
          this.error = true;
        }
      })
      .catch(error => console.log('Error' + error));
    }
  },
  template:`
    <Range-Filter v-model="range" v-bind:thresholds="thresholds"></Range-Filter>
    (your price range is from {{range.min}} to {{range.max}})
    <button v-on:click="this.range.min = 50; this.range.max = 600;">Reset</button>
    <ul>
      <span v-if="loading">Loading...</span>
      <span v-else-if="error">Uops! Something went wrong!</span>
      <li v-else v-for="flight in flights">
        <span>{{flight.from}} - {{flight.to}} - {{flight.price}}</span>
      </li>
    </ul>
    `
}

//== Range Filter Component ==================================================

/*
Note: use this syntax to watch a nested field

   watch: {
    'object.field': function() { ...  },
*/

const RangeFilterComponent = { // TODO
  props:['thresholds','modelValue'],
  emits:['update:modelValue'],

  data(){
    return{
      elements:{},
      flagColor:false,
      flagSymbol:false,
      newcolor: "black",
      symbols:['●','—',''],
      newSymbol: "",
      min:this.modelValue.min,
      max:this.modelValue.max,
      holds: this.thresholds,
    }
  },

  methods:{
    changeActive(){
      if(this.min==this.max){
        if(this.elements[this.min].color=='green'){
          this.elements[this.min].active=true
        }
        
        if(this.elements[this.max].color=='green'){
          this.elements[this.max].active=true
        }
        
      }
      
      if(this.elements[this.min].color=='green' && this.elements[this.max].color=='black'){
        this.elements[this.min].active=true;
      }
      if(this.elements[this.max].color=='green' && this.elements[this.min].color=='black'){
        this.elements[this.max].active=true;
      }
    },

    changeColor(color, key){
      if (this.elements[key].symbol==='●' && color === "black") {
        
          if(this.elements[this.min].active==false && this.elements[this.max].active === false) this.elements[key].active = true;
          this.elements[key].color = 'green';
          this.changeActive(); 
      }else{
          this.elements[key].color = 'black' 
          this.elements[key].active = false
          this.changeActive();
      }
    },
    changeSymbol(key){   
      
      
      if(this.min==key || this.max==key ) {
        console.log("circulo "+key)
        return this.elements[key].symbol= this.symbols[0]
      }

      
      console.log(this.min, this.max)
      //console.log(this.modelValue);

      50>220
      
      if(parseInt(key)> this.min && parseInt(key)< this.max){
        return this.elements[key].symbol=this.symbols[1];
      }else{
        return this.elements[key].symbol=this.symbols[2];
      }      
    },

    changeMinMax(key){
      if(this.elements[this.min].active){

        //console.log(this.min);
        //console.log("***********************")
        this.elements[this.min].symbol= this.symbols[2];
        console.log("seteando "+ this.min)
        console.log( this.elements[this.min].symbol)
        console.log("********************************")
        console.log(this.elements)
        this.elements[this.min].color= 'black';
        this.elements[this.min].active= false;
        this.elements[key].symbol=this.symbols[0];
        this.min=key;
      }

      
      if(this.elements[this.max].active){
        this.elements[this.max].symbol= this.symbols[2];
        this.elements[this.max].color= 'black';
        this.elements[this.max].active= false;
        this.elements[key].symbol=this.symbols[0];
        this.max=key;
        
       // key<this.max ? this.min=key : this.max=key
      }
      let aux;
      50>220
      if(parseInt(this.min)>parseInt(this.max)){
        aux=this.min;
        this.min=this.max
        this.max=aux
      }
      if(parseInt(this.max) < parseInt(this.min)){
        aux=this.max;
        this.max=this.min;
        this.min=aux;
      }
      let newRange = {
        min:this.min,
        max:this.max,
      }

      this.$emit('update:modelValue', newRange)
      this.changeActive();
        

    }

  },

  mounted(){
    this.newSymbol= this.symbols[2]
    
    //this.holds= [30, 40, 50, 60, 70, 80]
    //this.min =this.modelValue.min
    //this.max = this.modelValue.max
    this.holds= this.thresholds;
    this.holds.forEach((x)=>{
      let dic= {
        symbol: this.newSymbol,
        color: this.newcolor,
        active:false
      }
      this.elements[x]=dic;
    })
  },

  template: `
  <div class="range">
    <div  v-for="(item,key) in elements">
      <div :style="{color: item.color}" class="range-item" @click="changeColor(item.color,key)">{{changeSymbol(key)}}</div>
        <span @click="changeMinMax(key)" class="range-threshold">{{key}}
        </span>
      </div>
  </div>`
}


//== Instance ================================================================

const app = Vue.createApp(RootComponent);
app.component('Range-Filter', RangeFilterComponent);
const vm = app.mount("#app");
