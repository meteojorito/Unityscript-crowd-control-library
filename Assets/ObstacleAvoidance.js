#pragma strict

import System.Collections.Generic;

public class ObstacleAvoidance extends Steering{
	protected var miSphereCollider : SphereCollider;
	protected var threats : List.<GameObject>;
	public var obstacleTag = "obstacle";
	public var maxDistanceDetection : float;
	protected var minDistanceOfThreat : float;
	protected var vectDistOfThreat : Vector3;
	
	protected var velDeseada : Vector3;
	protected var direcDeGuiado : Vector3;
	
	public override function steeringVector(velocidad : Vector3, velMax : float) : Vector3{
		miSphereCollider = GetComponent.<SphereCollider>();
		direcDeGuiado = Vector3.zero;
		
		if(activateSteering && miSphereCollider != null){
			threats = new List.<GameObject>(GameObject.FindGameObjectsWithTag(obstacleTag));
			minDistanceOfThreat = maxDistanceDetection;
			var maxScale = Mathf.Max(Mathf.Max(transform.localScale.x, transform.localScale.y), transform.localScale.z);
			
			for(var threat : GameObject in threats){
				if(!isBehind(threat)){
					var dist : float = Vector3.Distance(transform.localPosition , threat.transform.localPosition);
					var maxScaleThreat = Mathf.Max(Mathf.Max(threat.transform.localScale.x, threat.transform.localScale.y), threat.transform.localScale.z);
					var sphereCollider = threat.GetComponent.<SphereCollider>();
					if(dist < maxDistanceDetection){
						var vectDist : Vector3 = threat.transform.localPosition - transform.localPosition;
						var vectDistProjection = Vector3.ProjectOnPlane(vectDist, transform.forward);
						var radiiSum : float = miSphereCollider.radius * maxScale + sphereCollider.radius * maxScaleThreat;

						if(dist < radiiSum && dist < minDistanceOfThreat){
							vectDistOfThreat = vectDist;
							minDistanceOfThreat = vectDistProjection.magnitude;
							//Debug.Log("Entra en el cilindro");
							
							direcDeGuiado = Vector3.Reflect(-vectDistProjection, transform.forward);

							//Debug.DrawRay(transform.localPosition, direcDeGuiado, Color.green, 500);
							//Debug.DrawRay(transform.localPosition, vectDist, Color.blue, 500);
						}
						//else Debug.Log("No entra en el cilindro");
					}
					//else Debug.Log("Esta demasiado lejos");
				}
				//else Debug.Log("Esta detras");
			}
		}
		
		//Debug.DrawRay(transform.localPosition, Vector3.Normalize(direcDeGuiado), Color.green, 500);
		return direcDeGuiado;
	}
	
	protected function isBehind(possibleThreat : GameObject) : boolean{
		var vectDist : Vector3 = possibleThreat.transform.localPosition - transform.localPosition;
		
		var dot = Vector3.Dot(Vector3.Normalize(vectDist), Vector3.Normalize(transform.forward));
		if(dot > 0) return false;
		else return true;
	}
}