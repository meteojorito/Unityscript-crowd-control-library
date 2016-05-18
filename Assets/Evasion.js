#pragma strict

public class Evasion extends Steering{
	public var pursuer : GameObject;
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3 = Vector3.zero;

	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		if(activateSteering){
			var dist = Vector3.Distance(pursuer.transform.localPosition, transform.localPosition);
			var velObj = pursuer.GetComponent.<Vehicle>().getVelocity();
			var estimPos = pursuer.transform.localPosition + velObj*dist;
			
			velDeseada = Vector3.Normalize(estimPos - transform.localPosition)*velMax;
			direcDeGuiado = velocidad - velDeseada;
		}
			
		return direcDeGuiado;
	}
}