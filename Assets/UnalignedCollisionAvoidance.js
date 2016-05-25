#pragma strict

import System.Collections.Generic;

public class UnalignedCollisionAvoidance extends Steering{
	protected var velDeseada : Vector3;
	protected var velMaxOrig : float;
	protected var mySphereCollider : SphereCollider;
	protected var sphereColliders : List.<SphereCollider>;
	protected var minDistOfCollision : float = 99999;
	public var obstacleTag = "obstacle";
	public var hitDistance : float = 3;
	
	protected var direcDeGuiado : Vector3;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering){
			var threats = new List.<GameObject>(GameObject.FindGameObjectsWithTag(obstacleTag));
			var myFuturePos : Vector3 = transform.localPosition + velocidad;
			var myRadii = Mathf.Max(Mathf.Max(transform.localScale.x, transform.localScale.y), transform.localScale.z);
			
			for(var threat : GameObject in threats){
				if(threat.name != this.name){
					var velThreat : Vector3 = threat.GetComponent(Vehicle).getVelocity();
					var threatFuturePos : Vector3 = threat.transform.localPosition + velThreat;
					var dist = Vector3.Distance(myFuturePos, threatFuturePos);
					var threatRadii = Mathf.Max(Mathf.Max(threat.transform.localScale.x, threat.transform.localScale.y), threat.transform.localScale.z);
					var radiiSum : float = (myRadii + threatRadii) + hitDistance;

					if(dist < radiiSum && dist < minDistOfCollision){
						minDistOfCollision = dist;
						
						if(imFurther(threat)){
							var vecDist = Vector3.Normalize(threatFuturePos - transform.localPosition);
							var distance = vecDist.magnitude;
							var slowingDistance : float = 1.0;
							var rampedSpeed = velMax * (distance / slowingDistance);
							var clippedSpeed = Mathf.Min(velMax, rampedSpeed);
							velDeseada = vecDist * (clippedSpeed / distance);
						}
						else
							velDeseada = Vector3.Normalize(threatFuturePos - transform.localPosition)*velMax*velMax;
						
						direcDeGuiado = Vector3.Reflect(-velDeseada, transform.forward);
						//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.green, 500);
					}
				}
			}
		}
		
		return direcDeGuiado;
	}
	
	protected function imFurther(threat : GameObject) : boolean{
		var vecFromMe : Vector3 = transform.forward*10;
		var vecFromThreat :Vector3 = (transform.localPosition + transform.forward*10) - threat.transform.localPosition;
		
		if(vecFromMe.magnitude > vecFromThreat.magnitude) return true;
		else return false;
	}
	
	public function getDirecDeGuiado(){
		return direcDeGuiado;
	}
}