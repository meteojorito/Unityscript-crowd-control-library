#pragma strict

public class Arrival extends Steering{
	public var objetivo : GameObject;
	public var slowingDistance : float;
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3 = Vector3.zero;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering){
			var vecDist = objetivo.transform.localPosition - transform.localPosition;
			var dist = vecDist.magnitude;
			var rampedSpeed = velMax * (dist / slowingDistance);
			var clippedSpeed = Mathf.Min(velMax, rampedSpeed);
			
			velDeseada = vecDist * (clippedSpeed / dist);
			direcDeGuiado = velDeseada - velocidad;
		}
		
		//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.blue, 500);
		if(this.name == "vehiculo 0") Debug.Log("arrival magnitude: "+direcDeGuiado.magnitude);
		
		return direcDeGuiado;
	}
}