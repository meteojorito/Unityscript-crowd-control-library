#pragma strict

public class Evasion extends Steering{
	public var pursuer : GameObject;
	public var evasionDistance : float = 3.0;
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
			var dist = Vector3.Distance(pursuer.transform.localPosition, transform.localPosition);
			
			if(dist < evasionDistance){
				var velObj = pursuer.GetComponent.<Vehicle>().getVelocity();
				var estimPos = pursuer.transform.localPosition + velObj*dist;
				
				velDeseada = Vector3.Normalize(estimPos - transform.localPosition)*velMax;
				direcDeGuiado = velocidad - velDeseada;
				
				if(neighborhoodDeactivation && GetComponent.<Neighborhood>() != null){
					neighborhoodControl(dist);
				}
			}
		}
		
		//if(this.name == "prey 0") Debug.Log("evasion magnitude: "+direcDeGuiado.magnitude);
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