#pragma strict

public class Flee extends Steering{
	public var objetivo : GameObject;
	protected var vel_deseada : Vector3;
	protected var direc_de_guiado : Vector3;

	public override function steeringVector(velocidad : Vector3, vel_max : float) : Vector3{
		direc_de_guiado = Vector3.zero;
		if(activateSteering){
			vel_deseada = Vector3.Normalize(objetivo.transform.localPosition - transform.localPosition)*vel_max;
			direc_de_guiado = velocidad - vel_deseada;
		}
		return direc_de_guiado;
	}
}