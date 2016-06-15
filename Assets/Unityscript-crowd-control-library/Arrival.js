#pragma strict

public class Arrival extends Steering{
	public var objetivo : GameObject;
	public var slowingDistance : float;
	public var yConstraint : boolean = false;
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3 = Vector3.zero;
	
	public var neighborhoodDeactivation : boolean = true;
	public var neighborhoodDeactivationDistance : float = 1.0;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering){
			var vecDist = objetivo.transform.localPosition - transform.localPosition;
			var dist = vecDist.magnitude;
			var rampedSpeed = velMax * (dist / slowingDistance);
			var clippedSpeed = Mathf.Min(velMax, rampedSpeed);
			
			if(clippedSpeed <= 0 && dist < 0.0001)
				direcDeGuiado = Vector3.zero;
			else{
				velDeseada = vecDist * (clippedSpeed / dist);
				direcDeGuiado = velDeseada - velocidad;
			}
						
			if(neighborhoodDeactivation && GetComponent.<Neighborhood>() != null){
				neighborhoodControl(dist);
			}
			
			//Debug.Log("Y sigo...");
		}
		
		//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.blue, 500);
		if(yConstraint == true) direcDeGuiado.y = 0.0;
		
		return direcDeGuiado;
	}
	
	protected function neighborhoodControl(dist : float){
		if(dist < neighborhoodDeactivationDistance){
			if(GetComponent.<Separation>() != null) GetComponent.<Separation>().activateSteering = false;
			if(GetComponent.<Cohesion>() != null) GetComponent.<Cohesion>().activateSteering = false;
			if(GetComponent.<Alignment>() != null) GetComponent.<Alignment>().activateSteering = false;
		}
		else{
			if(GetComponent.<Separation>() != null) GetComponent.<Separation>().activateSteering = true;
			if(GetComponent.<Cohesion>() != null) GetComponent.<Cohesion>().activateSteering = true;
			if(GetComponent.<Alignment>() != null) GetComponent.<Alignment>().activateSteering = true;
		}
	}
}