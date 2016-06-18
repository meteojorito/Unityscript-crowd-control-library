#pragma strict

import System.Collections.Generic;

public class Alignment extends Steering{
	protected var desiredVelocity : Vector3;
	protected var steeringVector : Vector3;
	protected var neighbors : List.<GameObject>;

	public function Start(){
		if(activateSteering && GetComponent.<Neighborhood>() != null && GetComponent.<Neighborhood>().activateSteering){
			neighbors = new List.<GameObject>(GameObject.FindGameObjectsWithTag(GetComponent.<Neighborhood>().getTag()));
		}
	}
	
	public function getSteeringVector(velocity : Vector3, maxSpeed : float) : Vector3{
		steeringVector = Vector3.zero;
		
		if(activateSteering && GetComponent.<Neighborhood>() != null && GetComponent.<Neighborhood>().activateSteering){
			var num : int = 0;
			var thereAreNeighbors : boolean = false;
			desiredVelocity = Vector3.zero;
			
			for(var neighbor : GameObject in neighbors){
				if(neighbor.transform.parent != null)
					neighbor = neighbor.transform.parent.gameObject;
				if(neighbor.name != this.name){
					var vecDist : Vector3 = transform.localPosition - neighbor.transform.localPosition;
					var angle : float = Vector3.Angle(transform.forward, vecDist);
					var topAngle : float = GetComponent.<Neighborhood>().getAngle();
					
					if(vecDist.magnitude < GetComponent.<Neighborhood>().getRadii() && angle > -topAngle && angle < topAngle){
						desiredVelocity += neighbor.transform.forward;
						num++;
						thereAreNeighbors = true;
					}
				}
			}
			
			if(thereAreNeighbors){
				if(num > 0) desiredVelocity /= num;
				steeringVector = desiredVelocity - velocity;
				var steeringVectorMag : float = steeringVector.magnitude;
				if(steeringVectorMag < 0.001) steeringVectorMag = 2;
				steeringVector = Vector3.Normalize(steeringVector)*(1/steeringVectorMag);
			}
			
			if(GetComponent.<Neighborhood>().getYConstraint()) steeringVector.y = 0.0;
		}
		
		return steeringVector;
	}
}