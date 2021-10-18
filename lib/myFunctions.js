//Genera un aleatorio entre un max y un min incluidos
function rand(max = 1, min = 0) {
  return parseInt(Math.random() * (max - min + 1)) + min;
}

//Extrae un elemento
Array.prototype.extract = function (i) {
  return this.splice(i, 1)[0];
};

//Extrae un elemento al azar
Array.prototype.extractR = function () {
  return this.extract(rand(this.length - 1));
};

//Obtiene un elemento al azar
Array.prototype.getR = function () {
  return this[rand(this.length - 1)];
};

//Extrae el primer elemento para insertarlo al final
Array.prototype.rotate = function () {
  this.push(this.shift());
};

//Revuelve los elementos al azar
Array.prototype.shuffle = function () {
  let range = this.length;
  while (--range) this.push(this.extract(rand(range)));
  return this;
};

//Quita los elementos que devuelven true en la funcion que pases como param
Array.prototype.quit = function (func) {
  let i = 0;
  while (i < this.length) func(this[i]) ? this.extract(i) : i++;
  return this;
};

module.exports = { rand };
