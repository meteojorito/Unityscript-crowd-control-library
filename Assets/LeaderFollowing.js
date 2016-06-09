#pragma strict

public class LeaderFollowing extends Steering{
	public var leaderTag = "leader";
	public var offset : float = 1.5;
	public var slowingDistance : float;
	public var hitDistance : float;
	protected var variableOffset : float;
	protected var leader : GameObject;
	protected var distance : float = 10;
	
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;
	
	public function Start(){
		
		leader = GameObject.FindGameObjectWithTag(leaderTag);
		
		if(leader != null){
			offset *= leader.transform.localScale.z;
		}
	}

	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering){
			
			if(leader != null){
				if(imInFront(leader)){
					var vectDist : Vector3 = leader.transform.localPosition - transform.localPosition;
					var dist : float = vectDist.magnitude;
					
					if(dist < hitDistance){
						var vectDistProjection = Vector3.ProjectOnPlane(vectDist, transform.forward);
						direcDeGuiado = Vector3.Reflect(-vectDistProjection, transform.forward);
					}
				}
				else{
					variableOffset = offset + (distance/10);
					//variableOffset = offset;
					
					var leaderPosition : Vector3 = leader.transform.localPosition + leader.transform.forward*(-variableOffset);
					//Debug.DrawRay(leader.transform.localPosition, leaderPosition - leader.transform.localPosition, Color.green, 0.01);
					var vecDist = leaderPosition - transform.localPosition;
					distance = vecDist.magnitude;
					var rampedSpeed = velMax * (distance / slowingDistance);
					var clippedSpeed = Mathf.Min(velMax, rampedSpeed);
					
					velDeseada = vecDist * (clippedSpeed / distance);
					direcDeGuiado = velDeseada - velocidad;
				}
			}
		}
		
		return direcDeGuiado;
	}
	
	protected function imInFront(leader : GameObject) : boolean{
		var vectDist : Vector3 = transform.localPosition - leader.transform.localPosition;
		
		var dot = Vector3.Dot(Vector3.Normalize(vectDist), Vector3.Normalize(leader.transform.forward));
		if(dot > 0) return true;
		else return false;
	}
}