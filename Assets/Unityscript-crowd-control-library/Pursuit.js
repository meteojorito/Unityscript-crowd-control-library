#pragma strict

public class Pursuit extends Steering{
	public var objetivo : GameObject;
	public var pursuitDistance : float = 3.0;
	public var yConstraint : boolean = false;
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3 = Vector3.zero;

	public var neighborhoodDeactivation : boolean = true;
	public var neighborhoodDeactivationDistance : float = 1.0;

	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		if(activateSteering){
			var dist = Vector3.Distance(objetivo.transform.localPosition, transform.localPosition);
			
			//if(this.name == "pursuer 0") Debug.Log("dist: "+dist+"; pursuitDistance: "+pursuitDistance);
			if(dist < pursuitDistance){
				var velObj = objetivo.GetComponent.<Vehicle>().getVelocity();
				var estimPos = objetivo.transform.localPosition + velObj*dist;
				
				velDeseada = Vector3.Normalize(estimPos - transform.localPosition)*velMax;
				direcDeGuiado = velDeseada - velocidad;
				
				if(neighborhoodDeactivation && GetComponent.<Neighborhood>() != null){
					neighborhoodControl(dist);
				}
			}
		}
		
		//if(this.name == "pursuer 0") Debug.Log("pursuit magnitude: "+direcDeGuiado.magnitude);
		if(yConstraint) direcDeGuiado.y = 0.0;
		
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