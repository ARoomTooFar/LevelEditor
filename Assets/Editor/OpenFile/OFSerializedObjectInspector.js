#pragma strict

// Declares this as the Unity Inspector for the OFSerializedObject class
// (firstpass/Plugins/OpenFile/OFSerializedObject.js?)
@CustomEditor ( OFSerializedObject )
public class OFSerializedObjectInspector extends Editor {
	private var resourceWarning : boolean = false;
	
	private function SavePrefab ( target : UnityEngine.Object ) {
		var selectedGameObject : GameObject;
		var selectedPrefabType : PrefabType;
		var parentGameObject : GameObject;
		var prefabParent : UnityEngine.Object;
		     
		selectedGameObject = Selection.gameObjects[0];
		selectedPrefabType = PrefabUtility.GetPrefabType(selectedGameObject);
		parentGameObject = selectedGameObject.transform.root.gameObject;
		prefabParent = PrefabUtility.GetPrefabParent(selectedGameObject);
		     
		EditorUtility.SetDirty(target);
		     
		if (selectedPrefabType == PrefabType.PrefabInstance) {
			PrefabUtility.ReplacePrefab(parentGameObject, prefabParent,
			ReplacePrefabOptions.ConnectToPrefab);
	    	}
	}
	
	/*
	 * Unity Editor Inspector for SerializableObject Object.
	 * Documentation indicates prefabs marked with this object and in the Resources folder
	 * will be automatically added in the level editor's list of objects that can be used.
	 * 
	 * To view, run the example editor, click the S in the side bar and
	 * add the example skydome.
	 * Object is Workspace/Skydome/Skydome
	 */
	override function OnInspectorGUI () {
		var obj : OFSerializedObject = target as OFSerializedObject;
		var inScene : boolean = obj.gameObject.activeInHierarchy;

		if ( !inScene ) {
			GUI.color = new Color ( 1, 1, 1, 0.5 );
		}
		
		// Instance
		EditorGUILayout.LabelField ( "Instance", EditorStyles.boldLabel );
		
		EditorGUILayout.BeginHorizontal ();

		/*
		 * Allows the inspector to assign a new ID to the object. Unsure why necessary. -EA
		 */
		EditorGUILayout.TextField ( "ID", obj.id );
		if ( inScene ) {
			GUI.backgroundColor = Color.green;
			if ( GUILayout.Button ( "Update", GUILayout.Width ( 60 ) ) ) {
				obj.RenewId();
			}
			GUI.backgroundColor = Color.white;
		}

		EditorGUILayout.EndHorizontal ();

		GUI.color = new Color ( 1, 1, 1, 1 );

		if ( !inScene ) {
			obj.id = "";
		
		} else {
			GUI.color = new Color ( 1, 1, 1, 0.5 );
		
		}

		// Begin Resource
		/*
		 * Displays the file path to the prefab file for the object.
		 */
		EditorGUILayout.Space ();
		EditorGUILayout.LabelField ( "Resource", EditorStyles.boldLabel );
		
		EditorGUILayout.BeginHorizontal ();

		EditorGUILayout.TextField ( "Path", obj.prefabPath );

		// When inspecting the object while it is not in the scene (ex. in the AllPrefabs folder in the Project panel)
		if ( !inScene ) {
			GUI.backgroundColor = Color.green;
			// If the Update button is clicked, gets the filepath
			if ( GUILayout.Button ( "Update", GUILayout.Width ( 60 ) ) ) {
				var path : String = AssetDatabase.GetAssetPath ( obj.gameObject );
				// If it's in the Resources Folder, things are good
				if ( path.Contains ( "/Resources/" ) ) {
					var strings : String [] = path.Split ( [ "/Resources/" ], System.StringSplitOptions.None );
					path = strings [ strings.Length - 1 ];
					path = path.Replace ( ".prefab", "" );

					obj.prefabPath = path;
					
					resourceWarning = false;
				// Otherwise, set a warning for later on
				} else {
					resourceWarning = true;		
				}
			}
			GUI.backgroundColor = Color.white;
		}	

		EditorGUILayout.EndHorizontal ();
		
		//If the warning was set, yell at the user about it in the inspector
		if ( resourceWarning ) {
			obj.prefabPath = "";
			GUI.color = Color.red;
			EditorGUILayout.LabelField ( "Object not in /Resources folder!", EditorStyles.boldLabel );
			GUI.color = Color.white;
		}
		// End Resource
		
		//Begin Components
		EditorGUILayout.Space ();
		
		GUI.color = new Color ( 1, 1, 1, 1 );

		EditorGUILayout.LabelField ( "Components", EditorStyles.boldLabel );
		//Get all components in the object.
		var allComponents : Component[] = obj.gameObject.GetComponents.<Component>();
		
		//For each component
		for ( var i : int = 0; i < allComponents.Length; i++ ) {
			//??? Does not appear to do anything useful? May have something to do with saving? -EA
			if ( !allComponents[i] ) { continue; }

			//Gets the string for the object name and strips 'UnityEngine.' from it
			var name : String = allComponents[i].GetType().ToString();
			name = name.Replace ( "UnityEngine.", "" );

			//If the object is the SerializedObject tagobjectthing, ignore it
			if ( allComponents[i].GetType() == OFSerializedObject ) {
				continue;
			}

			//If the component is serializable
			if ( OFSerializer.CanSerialize ( allComponents[i].GetType() ) ) {
				//Make a checkbox
				var hasField : boolean = obj.HasField ( name );
				hasField = EditorGUILayout.Toggle ( name, hasField );
		
				//If checked, add the component to the object as something to serialize when saving?
				if ( hasField ) {
					obj.SetField ( name, allComponents[i] );
				//Otherwise, remove it so it is not serialized when saving?
				} else {
					obj.RemoveField ( name );
				}
			//Otherwise, gray it out
			} else {
				GUI.color = new Color ( 1, 1, 1, 0.5 );
				EditorGUILayout.LabelField ( name );
				GUI.color = Color.white;			
			}		
		}
		//End Components


		//Begin File Operations
		EditorGUILayout.Space ();
		EditorGUILayout.LabelField ( "File operations", EditorStyles.boldLabel );
		EditorGUILayout.BeginHorizontal ();

		//Textbox is filepath to export to
		obj.exportPath = EditorGUILayout.TextField ( obj.exportPath );

		//Saves the object to the filepath
		if ( GUILayout.Button ( "Export" ) ) {
			OFWriter.SaveFile ( OFSerializer.Serialize ( obj ), Application.dataPath + "/" + obj.exportPath + "/" + obj.name + ".json" );
		}
		
		EditorGUILayout.EndHorizontal ();

		//If anything in this editor panel is changed, save the Prefab
		//I managed to screw up the skydome prefab by messing around with it. Potentially dangerous -EA
		if ( GUI.changed ) {
			SavePrefab ( target );
		}
		//End File Operations
	}
}
