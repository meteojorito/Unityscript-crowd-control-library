#pragma strict

public class Arrival extends Steering{
	public var objetivo : GameObject;
	public var slowingDistance : float;
	public var offset : float = 0.0;
	@HideInInspector
	public var distanceToTarget : float = 0.0;
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3 = Vector3.zero;
	
	public var neighborhoodDeactivation : boolean = true;
	public var neighborhoodDeactivationDistance : float = 1.0;
	protected var sepWeight : float;
	protected var cohWeight : float;
	protected var aliWeight : float;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering){
			var targetPosition : Vector3 = objetivo.transform.localPosition + objetivo.transform.forward*offset;
			var vecDist = targetPosition - transform.localPosition;
			distanceToTarget = vecDist.magnitude;
			var rampedSpeed = velMax * (distanceToTarget / slowingDistance);
			var clippedSpeed = Mathf.Min(velMax, rampedSpeed);
			
			velDeseada = vecDist * (clippedSpeed / distanceToTarget);
			direcDeGuiado = velDeseada - velocidad;
			
			if(neighborhoodDeactivation && GetComponent.<Neighborhood>() != null){
				neighborhoodControl(distanceToTarget);
			}
		}
		
		//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.blue, 500);
		
		return direcDeGuiado;
	}
	
	protected function neighborhoodControl(dist : float){
		if(dist < neighborhoodDeactivationDistance){
			if(GetComponent.<Separation>() != null){
				sepWeight = GetComponent.<Separation>().steeringWeight;
				GetComponent.<Separation>().steeringWeight = 0.0;
			}
			if(GetComponent.<Cohesion>() != null){
				cohWeight = GetComponent.<Cohesion>().steeringWeight;
				GetComponent.<Cohesion>().steeringWeight = 0.0;
			}
		}
		else{
			if(GetComponent.<Separation>() != null && GetComponent.<Separation>().steeringWeight == 0.0)
				GetComponent.<Separation>().steeringWeight = sepWeight;
			if(GetComponent.<Cohesion>() != null && GetComponent.<Cohesion>().steeringWeight == 0.0)
				GetComponent.<Cohesion>().steeringWeight = cohWeight;
		}
	}
}