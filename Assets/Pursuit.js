#pragma strict

public class Pursuit extends Steering{
	public var objetivo : GameObject;
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3 = Vector3.zero;

	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		if(activateSteering){
			var dist = Vector3.Distance(objetivo.transform.localPosition, transform.localPosition);
			var velObj = objetivo.GetComponent(Vehicle).getVelocity();
			var estimPos = objetivo.transform.localPosition + velObj*dist;
			
			velDeseada = Vector3.Normalize(estimPos - transform.localPosition)*velMax;
			direcDeGuiado = velDeseada - velocidad;
		}
		
		return direcDeGuiado;
	}
}