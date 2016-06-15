#pragma strict

enum enumerado{UNO = 0, DOS = 1, TRES = 2};
var numNumeros : int = 3;
var numero : enumerado;
var listaNumeros : enumerado[];

function Start () {
	numero = enumerado.UNO;
	listaNumeros = new enumerado[3];
}

function Update () {
	var j : int = 0;
	for(var i in enumerado){
		listaNumeros[j] = i;
		Debug.Log(listaNumeros[i]);
	}
}