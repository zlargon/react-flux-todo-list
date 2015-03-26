
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var actions = require('../actions/AppActionCreator');
var EventEmitter = require('events').EventEmitter;

//========================================================================
//
// Private vars

// 假資料
// item: {name: '', uid: null, created: null}
var arrTodos = [];

// debug 用
window.arrTodos = arrTodos;

// 目前選取的 todo 項目
var selectedItem = null;

// header 裏隨打即查輸入的文字
var searchFilter = '';

//========================================================================
//
// Public API

var Store = {};

// 建立 Store class，並且繼承 EventEMitter 以擁有廣播功能
Object.assign( Store, EventEmitter.prototype, {

	// Public API
	// 供外界取得 store 內部資料
    getAll: function(){
        return {
            arrTodos: arrTodos,
            selectedItem: selectedItem,
            filter: searchFilter,
            screenSize: screenSize
        }
    },

    //
    noop: function(){}
});




//========================================================================
//
// event handlers

// 向 Dispatcher 註冊自已，才能偵聽到系統發出的事件
// 並且取回 dispatchToken 供日後 async 操作用
Store.dispatchToken = AppDispatcher.register( function eventHandlers(evt){

    // evt.action 就是 view 當時廣播出來的整包物件
    // 它內含 actionType
    var action = evt.action;

    switch (action.actionType) {

    	// optimistic 成功後要依 tid 來更新 item 的 uid
    	case AppConstants.OBJECT_SERVER_RESULT:

    		// 此時 server 已建立好物件，指定正確 uid
    		// 這裏要依 tid 找出物件，設定 server 指派的 uid 值
    		var tid = action.item.tid;

    		let item;
    		for ( item of arrTodos ){
    			if( item.tid == tid ){
    				item.uid = action.item.uid;	// 將 server 指派的正式 uid 灌入 instance 中
    				item.tid = null; // 處理完就清空這個值
    				break;
    			}
    		}

    		// 由於沒使用 immutable model 因此是 pass by reference，這裏不用觸發 change event

    		break;

    	// rollback 將新增的資料移除
    	case AppConstants.OBJECT_SERVER_ERROR:

    		var tid = action.tid;

    		for ( let item of arrTodos ){
    			if( item.tid == tid ){
    				arrTodos.splice( arrTodos.indexOf(item), 1 )
    				break;
    			}
    		}

    		// 由於 model 已實質改變，必需廣播 change 事件讓 view 重繪
            Store.emit( AppConstants.CHANGE_EVENT );

    		break;

    	//
        case AppConstants.TODO_READ:
            arrTodos = arrTodos.concat( action.items );
            Store.emit( AppConstants.CHANGE_EVENT );
            break;


        //
        case AppConstants.TODO_CREATE:

            arrTodos.push( action.item );

            // console.log( 'Store 新增: ', arrTodos );

            // 將新增的項目設為 selected，將來在 ui 裏會高亮與自動捲動
            selectedItem = action.item;

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        //
        case AppConstants.TODO_REMOVE:

            arrTodos = arrTodos.filter( function(item){
                return item != action.item;
            })

            // console.log( 'Store 刪完: ', arrTodos );

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        //
        case AppConstants.TODO_UPDATE:

            // console.log( 'Store 更新: ', arrTodos );

            for( let item of arrTodos ){
            	if( item.uid == action.item.uid ){
            		item.name = action.newVal;
            	}
            }

            Store.emit( AppConstants.CHANGE_EVENT );

            break;

        //
        case AppConstants.ToDO_SELECT:

            // console.log( 'Store 選取: ', action.item );

            // 選取同樣的 item 就不用處理下去了
            if( selectedItem != action.item ){
                selectedItem = action.item;
                Store.emit( AppConstants.CHANGE_EVENT );
            }

            break;

        //
        case AppConstants.TODO_FILTER:

            // console.log( 'Store 查詢: ', action.val );

            if( searchFilter != action.val ){
                searchFilter = action.val
                Store.emit( AppConstants.CHANGE_EVENT );
            }

            break;



        default:
            //
    }

})

//========================================================================
//
// private


// 為了 RWD 偷放的 screenSize 判斷
window.addEventListener('resize', handleResize );
handleResize();
var idResize;
var screenSize;

function handleResize(){

    clearTimeout( idResize );

    idResize = setTimeout(function(){

        var body = document.body;
        var size;

        if(body.scrollWidth > 1024){
            size = 'desktop';
        }else if(body.scrollWidth > 480){
            size = 'tablet';
        }else{
            size = 'phone';
        }

        console.log( 'resize: ', body.scrollWidth, body.scrollHeight, ' >size: ', size );

        screenSize = size;

    }.bind(this), 0)

}


//
module.exports = Store;
