#pragma strict

public class LeaderFollowing extends Steering{
	public var leaderTag = "leader";
	public var offset : float = 1.5;
	public var slowingDistance : float;
	public var hitDistance : float;
	protected var variableOffset : float;
	protected var leader : GameObject;
	protected var distance : float = 0;
	
	protected var desiredVelocity : Vector3;
	protected var steeringVector : Vector3;
	
	public function Start(){
		
		leader = GameObject.FindGameObjectWithTag(leaderTag);
		
		if(leader != null){
			if(leader.transform.parent != null)
				leader = leader.transform.parent.gameObject;
				
			//offset *= leader.transform.localScale.z;
		}
	}

	public function getSteeringVector(velocity : Vector3, maxSpeed : float) : Vector3{
		steeringVector = Vector3.zero;
		
		if(activateSteering){
			
			if(leader != null){
				var vectDist : Vector3 = leader.transform.localPosition - transform.localPosition;
				var dist : float = vectDist.magnitude;

				if(imInFront(leader) && dist < hitDistance){
					vectDist = Vector3.Normalize(vectDist);
					var vectDistProjection = Vector3.ProjectOnPlane(vectDist, transform.forward);
					steeringVector = Vector3.Reflect(-vectDistProjection, transform.forward);
				}
				else{
					variableOffset = offset + (distance/10);
					
					var leaderPosition : Vector3 = leader.transform.localPosition + leader.transform.forward*(-variableOffset);
					var vecDist = leaderPosition - transform.localPosition;
					distance = vecDist.magnitude;
					var rampedSpeed = maxSpeed * (distance / slowingDistance);
					var clippedSpeed = Mathf.Min(maxSpeed, rampedSpeed);
					
					desiredVelocity = vecDist * (clippedSpeed / distance);
					steeringVector = desiredVelocity - velocity;
				}
			}
		}
		
		return steeringVector;
	}
	
	protected function imInFront(leader : GameObject) : boolean{
		var vectDist : Vector3 = transform.localPosition - leader.transform.localPosition;
		
		var dot = Vector3.Dot(Vector3.Normalize(vectDist), Vector3.Normalize(leader.transform.forward));
		if(dot > 0) return true;
		else return false;
	}
}