/**
 * Generated by Verge3D Puzzles v.2.14.0 pre1
 * Sun Aug 18 2019 12:14:12 GMT+0300 (Москва, стандартное время)
 * Do not edit this file - your changes may get overridden when Puzzles are saved.
 * Refer to https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for information on how to add your own JavaScript to Verge3D apps.
 */

"use strict";

(function() {

// global variables/constants used by puzzles' functions
var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.objClickCallbacks = [];
_pGlob.pickedObject = '';
_pGlob.objHoverCallbacks = [];
_pGlob.hoveredObject = '';
_pGlob.objMovementInfos = {};
_pGlob.objDragOverCallbacks = [];
_pGlob.objDragOverInfoByBlock = {}
_pGlob.dragMoveOrigins = {};
_pGlob.dragScaleOrigins = {};
_pGlob.mediaElements = {};
_pGlob.loadedFiles = {};
_pGlob.loadedFile = '';
_pGlob.animMixerCallbacks = [];
_pGlob.arHitPoint = new v3d.Vector3(0, 0, 0);
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.animateParamUpdate = null;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();
_pGlob.timers = {};

var _pPhysics = {};

_pPhysics.syncList = [];

// internal info
_pPhysics.collisionData = [];

// goes to collision callback
_pPhysics.collisionInfo = {
    objectA: '',
    objectB: '',
    distance: 0,
    positionOnA: [0, 0, 0],
    positionOnB: [0, 0, 0],
    normalOnB: [0, 0, 0]
};

var PL = v3d.PL = v3d.PL || {};

PL.legacyMode = false;

PL.execInitPuzzles = function() {

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }
    
    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {

initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}
var data_muz, info_style, obj, tmp, dome_rotate, camera_locale;


// readCSV puzzle
function readCSV(text, delimit, from) {
    return v3d.CSVParser.parse(text,
        {delimiter: delimit, skipinitialrows: from});
}



// dictSet puzzle
function dictSet(dict, key, value) {
    if (dict && typeof dict == 'object')
        dict[key] = value;
}



// loadData puzzle
function loadFile(url, callback) {

    var files = _pGlob.loadedFiles;

    if (!url || (typeof url != 'string')) {
        _pGlob.loadedFile = '';
        callback();
    } else if (url in files) {
        _pGlob.loadedFile = files[url];
        callback();
    } else {
        var loader = new v3d.FileLoader();
        loader.load(url,
            function(data) {
                _pGlob.loadedFile = data;
                callback();
            },
            function() {},
            function() {
                _pGlob.loadedFile = '';
                callback();
            }
        );
    }
}



// utility functions envoked by the HTML puzzles
function getElements(ids, isParent) {
    var elems = [];
    if (Array.isArray(ids) && ids[0] != "WINDOW" && ids[0] != "DOCUMENT" && ids[0] != "BODY") {
        for (var i = 0; i < ids.length; i++)
            elems.push(getElement(ids[i], isParent));
    } else {
        elems.push(getElement(ids, isParent));
    }
    return elems;
}

function getElement(id, isParent) {
    var elem;
    if (Array.isArray(id) && id[0] == "WINDOW") {
        if (isParent)
            elem = parent;
        else
            elem = window;
    } else if (Array.isArray(id) && id[0] == "DOCUMENT") {
        if (isParent)
            elem = parent.document;
        else
            elem = document;
    } else if (Array.isArray(id) && id[0] == "BODY") {
        if (isParent)
            elem = parent.document.body;
        else
            elem = document.body;
    } else {
        if (isParent)
            elem = parent.document.getElementById(id);
        else
            elem = document.getElementById(id);
    }
    return elem;
}



// getHTMLElemAttribute puzzle
function getHTMLElemAttribute(attr, id, isParent) {
    var elem = getElement(id, isParent);
    return elem ? elem[attr]: '';
}



// addHTMLElement puzzle
function addHTMLElement(elemType, id) {
    var elem = document.createElement(elemType);
    document.body.appendChild(elem);
    elem.id = id;
    elem.style.position = "absolute";
}



// setHTMLElemAttribute puzzle
function setHTMLElemAttribute(attr, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem[attr] = value;
    }
}



// setHTMLElemStyle puzzle
function setHTMLElemStyle(prop, value, ids, isParent) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem || !elem.style)
            continue;
        elem.style[prop] = value;
    }
}



// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc;
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = typeof _pGlob != "undefined";
    objFound = runTime ? _pGlob.objCache[objName] : null;
    if (objFound && objFound.name == objName)
        return objFound;
    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime)
                _pGlob.objCache[objName] = objFound;
        }
    });
    return objFound;
}

// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}

// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return (obj.type != "Scene" && obj.type != "AmbientLight" &&
            obj.name != "" && !(obj.isMesh && obj.isMaterialGeneratedMesh));
}

// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}

/**
 * Blender/Max to Verge3D
 */
function swizzleValueSign(newAxis, value) {
    newAxis = newAxis.toLowerCase();

    if (newAxis == 'z') {
        if (typeof value == 'number')
            return -value
        else if (typeof value == 'string' && value != '' && value != "''" && value != '""')
            return String(-Number(value));
        else
            return value;
    } else
        return value;
}

/**
 * Blender/Max to Verge3D
 */
function swizzleVec3(vec, isScale) {

    var dest = []

    dest[0] = vec[0];
    dest[1] = vec[2];
    dest[2] = isScale ? vec[1] : swizzleValueSign('z', vec[1])

    return dest;
}

/**
 * mesh or multi-material object
 */
function isMeshObj(obj) {
    if (obj.isMesh)
        return true;

    for (var i = 0; i < obj.children.length; i++) {
        var child = obj.children[i];
        if (child.isMesh && child.isMaterialGeneratedMesh)
            return true;
    }

    return false;
}



// outline puzzle
function outline(objNames, doWhat) {
    objNames = retrieveObjectNames(objNames);
    if (!objNames)
        return;
    if (!appInstance.postprocessing || !appInstance.postprocessing.outlinePass)
        return;
    var outlineArray = appInstance.postprocessing.outlinePass.selectedObjects;
    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        var obj = getObjectByName(objName);
        if (!obj)
            continue;
        if (doWhat == "ENABLE") {
            if (outlineArray.indexOf(obj) == -1)
                outlineArray.push(obj);
        } else {
            var index = outlineArray.indexOf(obj);
            if (index > -1)
                outlineArray.splice(index, 1);
        }
    }
}



// dictGet puzzle
function dictGet(dict, key) {
    if (dict && typeof dict == 'object')
        return dict[key];
}



// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart) {

    var elem = appInstance.container;
    elem.addEventListener(eventType, pickListener);
    if (eventType == "mousedown") {
        var touchEventName = mouseDownUseTouchStart ? "touchstart" : "touchend";
        elem.addEventListener(touchEventName, pickListener);
    }

    var raycaster = new v3d.Raycaster();
    function pickListener(event) {
        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.camera);
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        if (intersects.length > 0) {
            var obj = intersects[0].object;
            callback(obj, event);
        } else {
            callback(null, event);
        }
    }
}

// utility function used by the whenDraggedOver puzzles
function fireObjectPickingCallbacks(objName, source, index, cbParam) {
    for (var i = 0; i < source.length; i++) {
        var cb = source[i];
        if (objectsIncludeObj([cb[0]], objName)) {
            cb[index](cbParam);
        }
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// whenHovered puzzle
initObjectPicking(function(obj) {

    var prevHovered = _pGlob.hoveredObject;
    var currHovered = obj ? getPickedObjectName(obj) : "";

    if (prevHovered == currHovered) return;

    // first - all "out" callbacks, then - all "over"
    _pGlob.objHoverCallbacks.forEach(function(el) {
        if (objectsIncludeObj(el.objNames, prevHovered)) {
            // ensure the correct value of the hoveredObject block
            _pGlob.hoveredObject = prevHovered;
            el.callbacks[1]();
        }
    });

    _pGlob.objHoverCallbacks.forEach(function(el) {
        if (objectsIncludeObj(el.objNames, currHovered)) {
            // ensure the correct value of the hoveredObject block
            _pGlob.hoveredObject = currHovered;
            el.callbacks[0]();
        }
    });

    _pGlob.hoveredObject = currHovered;
}, 'mousemove');



// whenHovered puzzle
function registerOnHover(objNames, callback_over, callback_out) {
    objNames = retrieveObjectNames(objNames) || [];
    var objNamesFiltered = objNames.filter(function(name) {
        return name;
    });

    _pGlob.objHoverCallbacks.push({
        objNames: objNamesFiltered,
        callbacks: [callback_over, callback_out]
    });
}


/**
 * Describe this function...
 */
function ORDER_HOVER() {
  registerOnHover(["ALL_OBJECTS"], function() {
    if (_pGlob.hoveredObject == "$1_DOME") {
      setHTMLElemStyle('cursor', 'default', ["BODY"], false);
      setHTMLElemAttribute('style', 'opacity: 0.0;', 'info', false);
      outline(_pGlob.hoveredObject, "DISABLE");
    } else {
      setHTMLElemStyle('cursor', 'pointer', ["BODY"], false);
      outline(_pGlob.hoveredObject, "ENABLE");
      tmp = _pGlob.hoveredObject;
      if (typeof data_muz == 'object' && data_muz.hasOwnProperty(tmp)) {
        tmp = dictGet(data_muz, tmp);
      } else {
        tmp = String('Описание отсутствует. Спросите у Ирины Владимировны. ') + String(tmp);
      }
      setHTMLElemAttribute('innerHTML', tmp, 'info', false);
      tmp = Math.ceil(Math.min.apply(null, [getHTMLElemAttribute('innerHeight', ["WINDOW"], false), getHTMLElemAttribute('innerWidth', ["WINDOW"], false)]) / 36);
      setHTMLElemAttribute('style', [info_style,['font-size: ',tmp,'px;'].join(''),['font-size: ',tmp,'px;'].join(''),'opacity: 1;'].join(''), 'info', false);
    }
  }, function() {
    setHTMLElemStyle('cursor', 'default', ["BODY"], false);
    outline(_pGlob.hoveredObject, "DISABLE");
  });
}


// setObjTransform puzzle
function setObjTransform(objNames, mode, x, y, z, offset) {

    objNames = retrieveObjectNames(objNames);
    if (!objNames) return;

    function setObjProp(obj, prop, val) {
        if (typeof val != "number")
            return;
        if (mode == "rotation")
            val = val * Math.PI/180;
        if (!offset) {
            obj[mode][prop] = val;
        } else {
            if (mode != "scale")
                obj[mode][prop] += val;
            else
                obj[mode][prop] *= val;
        }
    }

    var inVec = swizzleVec3([x,y,z], mode == 'scale');
    x = inVec[0];
    y = inVec[1];
    z = inVec[2];

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName) continue;

        var obj = getObjectByName(objName);
        if (!obj) continue;

        setObjProp(obj, "x", x);
        setObjProp(obj, "y", y);
        setObjProp(obj, "z", z);

        obj.updateMatrixWorld(true);
    }
}



// setInterval puzzle
function registerInterval(timeout, callback) {
    window.setInterval(callback, 1000 * timeout);
}



// eventHTMLElem puzzle
function eventHTMLElem(eventType, ids, isParent, callback) {
    var elems = getElements(ids, isParent);
    for (var i = 0; i < elems.length; i++) {
        var elem = elems[i];
        if (!elem)
            continue;
        elem.addEventListener(eventType, callback, false);
    }
}


/**
 * Describe this function...
 */
function ORDER_CONTROL() {
  // ff
  addHTMLElement('div', 'control');
  setHTMLElemAttribute('innerHTML', 'q', 'control', false);
  setHTMLElemAttribute('style', ['position: absolute;','padding: 15px; border-radius: 15px;','background-color: #EEEEDD;','color: #FF9922; text-shadow: 2px 2px 2px #000000, 0 0 3px #000000;','opacity: 1;','font-family: webdings;','','','top: 50px;','','text-align: center;','font-size: 72px;','box-shadow: 0 0 15px 12px rgba(0,0,0,0.6);','background: linear-gradient(to top, #3355AA, #113377); line-height: 0.3; border: 5px solid  #3355AA transparent;',''].join(''), 'control', false);
  eventHTMLElem('click', 'control', false, function(event) {
    dome_rotate = !dome_rotate;
  });
}

/**
 * Describe this function...
 */
function START_INTRO() {
  // ff
  addHTMLElement('div', 'intro');
  setHTMLElemAttribute('innerHTML', ['<p>виртуальный 3D музей</p>','<p>панорама 360°</p>','<p><<<<< старт >>>>></p>'].join(''), 'intro', false);
  setHTMLElemAttribute('style', ['position: absolute;','padding: 50px; border-radius: 25px;','background-color: #EEEEDD;','color: #FF9922; text-shadow: 2px 2px 2px #000000, 0 0 3px #000000;','opacity: 1;','font-family: sans-serif;','left: 50px;','right: 50px;','bottom: 50px;','','text-align: center;','font-size: 72px;','box-shadow: 0 0 15px 12px rgba(0,0,0,0.6);','background: linear-gradient(to top, #3355AA, #113377); line-height: 0.3; border: 5px solid  #3355AA;',''].join(''), 'intro', false);
  eventHTMLElem('click', 'intro', false, function(event) {
    setHTMLElemStyle('display', 'none', 'intro', false);
    camera_locale = -10;
    setObjTransform("Camera", "position", '', camera_locale, '', false);
  });
}


START_INTRO();

data_muz = {};
loadFile('data_muz.csv', function() {
  tmp = readCSV(_pGlob.loadedFile, ';', 1);
  for (var obj_index in tmp) {
    obj = tmp[obj_index];
    dictSet(data_muz, obj[0], obj[2]);
  }
});
info_style = ['','position: absolute;','padding: 20px;','background-color: #AA22FF;','color: white;','transition: opacity 1.2s;','left: 0px;','right: 0px;','font-family: sans-serif;','bottom: 0px;','text-align: center; text-shadow: 2px 4px 3px rgba(0,0,0,0.3);','','float: right;','cursor: pointer;','transition: 0.3s;'].join('');
if (getHTMLElemAttribute('id', 'info', false) != 'info') {
  addHTMLElement('div', 'info');
  setHTMLElemAttribute('style', String(info_style) + String('opacity: 0.0;'), 'info', false);
}

ORDER_HOVER();
ORDER_CONTROL();

info_style;

0 == 0;

0 == 0;

setHTMLElemAttribute('style', ['font-weight: bold;','float: right;','font-size: 22px;','line-height: 20px;','cursor: pointer;','transition: 0.3s;'].join(''), 'close_btn', false);

dome_rotate = true;
registerInterval(0.01, function() {
  setObjTransform("room#1", "rotation", '', '', dome_rotate ? 0.01 : 0, true);
});

camera_locale = -50;
setObjTransform("Camera", "position", '', camera_locale, '', false);

} // end of PL.init function

if (window.v3dApp) {
    // backwards compatibility for old player projects
    PL.legacyMode = true;
    PL.init(window.v3dApp);
}

})(); // end of closure

/* ================================ end of code ============================= */
