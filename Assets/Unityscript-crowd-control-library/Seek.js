#pragma strict

public class Seek extends Steering{
	public var objetivo : GameObject;
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;

	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		velDeseada = Vector3.Normalize(objetivo.transform.localPosition - transform.localPosition)*velMax;
		direcDeGuiado = velDeseada - velocidad;
		
		return direcDeGuiado;
	}
}