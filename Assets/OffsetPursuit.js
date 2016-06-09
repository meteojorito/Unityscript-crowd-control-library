#pragma strict

public class OffsetPursuit extends Steering{
	public var objetivo : GameObject;
	public var offset : float;
	public var pursuitDistance : float = 3.0;
	public var yConstraint : boolean = false;
	
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3 = Vector3.zero;
	
	public var neighborhoodDeactivation : boolean = true;
	public var neighborhoodDeactivationDistance : float = 1.0;
	protected var sepWeight : float;
	protected var cohWeight : float;
	protected var aliWeight : float;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		if(activateSteering){
			var dist = Vector3.Distance(objetivo.transform.localPosition, transform.localPosition);
			
			if(dist < pursuitDistance){
				var velObj = objetivo.GetComponent(Vehicle).getVelocity();
				var estimPos = objetivo.transform.localPosition + velObj*dist;
				var vecEstimDist = estimPos - transform.localPosition;
				var proj = Vector3.ProjectOnPlane(vecEstimDist, transform.forward);
				//Debug.DrawRay(transform.localPosition, proj, Color.green, 500);
				var vecOffset = Vector3.Normalize(proj) * (-offset);
				Debug.DrawRay(objetivo.transform.localPosition, vecOffset, Color.green, 500);

				//estimPos = transform.TransformPoint(estimPos + vecOffset);
				estimPos += vecOffset;
				//var aux : Vector3 = estimPos - objetivo.transform.localPosition;
				//Debug.DrawRay(objetivo.transform.localPosition, aux, Color.green, 500);
				velDeseada = Vector3.Normalize(estimPos - transform.localPosition)*velMax;
				direcDeGuiado = velDeseada - velocidad;
				
				if(neighborhoodDeactivation && GetComponent.<Neighborhood>() != null){
					neighborhoodControl(dist);
				}
			}
		}
		if(yConstraint) direcDeGuiado.y = 0.0;
		
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
			if(GetComponent.<Alignment>() != null){
				aliWeight = GetComponent.<Alignment>().steeringWeight;
				GetComponent.<Alignment>().steeringWeight = 0.0;
			}
		}
		else{
			if(GetComponent.<Separation>() != null && GetComponent.<Separation>().steeringWeight == 0.0)
				GetComponent.<Separation>().steeringWeight = sepWeight;
			if(GetComponent.<Cohesion>() != null && GetComponent.<Cohesion>().steeringWeight == 0.0)
				GetComponent.<Cohesion>().steeringWeight = cohWeight;
			if(GetComponent.<Alignment>() != null && GetComponent.<Alignment>().steeringWeight == 0.0)
				GetComponent.<Alignment>().steeringWeight = aliWeight;
		}
	}
}