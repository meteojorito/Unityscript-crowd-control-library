#pragma strict

import System.Collections.Generic;

public class UnalignedCollisionAvoidance extends Steering{
	protected var velDeseada : Vector3;
	protected var threats : List.<GameObject>;
	protected var minDistanceOfThreat : float;
	public var maxDistanceDetection : float = 1.0;
	public var obstacleTag = "obstacle";
	public var yConstraint : boolean = false;

	protected var myRadii : float;
	
	protected var direcDeGuiado : Vector3;

	public function Start(){
		if(activateSteering && GetComponent.<SphereCollider>() != null){
			threats = new List.<GameObject>(GameObject.FindGameObjectsWithTag(obstacleTag));
			var myMaxScale :float = Mathf.Max(Mathf.Max(transform.localScale.x, transform.localScale.y), transform.localScale.z);
			myRadii = GetComponent.<SphereCollider>().radius * myMaxScale;
		}
	}
	
	public function getSteeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering && GetComponent.<SphereCollider>() != null){
			var vecDist : Vector3 = Vector3.zero;
			var threatSpeed : float;

			var myFuturePos : Vector3 = transform.localPosition + velocidad;
			minDistanceOfThreat = maxDistanceDetection;
			
			for(var threat : GameObject in threats){
				if(threat.transform.parent != null)
					threat = threat.transform.parent.gameObject;
				if(threat.name != this.name && threat.GetComponent.<SphereCollider>() != null){
					if(threat.GetComponent.<Vehicle>() == null) Debug.Log("name: "+name+"; no hay vehiculo");
					var velThreat : Vector3 = threat.GetComponent(Vehicle).getVelocity();
					var threatFuturePos : Vector3 = threat.transform.localPosition + velThreat;
					var dist = Vector3.Distance(myFuturePos, threatFuturePos);
					
					var threatMaxScale = Mathf.Max(Mathf.Max(threat.transform.localScale.x, threat.transform.localScale.y), threat.transform.localScale.z);
					var threatRadii = threat.GetComponent.<SphereCollider>().radius * threatMaxScale;
					
					//Debug.Log("name: "+name+"; radius: "+myRadii+"; dist: "+dist);
					
					var radiiSum : float = myRadii + threatRadii;

					if(dist < radiiSum && dist < minDistanceOfThreat){
						vecDist = threatFuturePos - transform.localPosition;
						
						threatSpeed = velThreat.magnitude;
						minDistanceOfThreat = dist;
					}
				}
			}
			
			if(vecDist != Vector3.zero){
				var mySpeed : float = velocidad.magnitude;
				if(mySpeed < threatSpeed){
					var distance = vecDist.magnitude;
					var slowingDistance : float = dist;
					var rampedSpeed = velMax * (distance / slowingDistance);
					var clippedSpeed = Mathf.Min(velMax, rampedSpeed);
					velDeseada = vecDist * (clippedSpeed / distance);
				}
				else
					velDeseada = vecDist*2;
				
				if(yConstraint == true) velDeseada.y = 0.0;
				
				var vectDistProjection = Vector3.ProjectOnPlane(velDeseada, transform.forward);
				direcDeGuiado = Vector3.Reflect(-vectDistProjection, transform.forward);
			}
		}
		
		return direcDeGuiado;
	}
}