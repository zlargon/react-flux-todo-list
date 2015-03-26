
// 注意不是 var fetch = require('whatwg-fetch') 因為它是直接掛上 widnow.fetch
require('whatwg-fetch');

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var shortid = require('shortid');

var url = 'http://localhost:3000/Dummy/';

/**
 * 這是一個 singleton 物件
 */
var AppActionCreators = {

    /**
     * app 啟動後，從 server 取回一包初始資料
     * 這支目前沒用到
     */
    load: function(){
		fetch( url, {
		  method: 'get'
		})
		.then(function(res){
			res.json().then(function(data){
				AppDispatcher.handleServerAction({
				    actionType: AppConstants.TODO_READ,
				    items: [] // 送一包假資料進去
				});
			})
		})
    },

    /**
     *
     */
    createTodo: function( item ) {

        // transaction id, 用來比對 local & server 物件，就能更新 doc.uid
        var tid = "t_" + shortid.generate();

        item.tid = tid;

        // 1. 先廣播給 store 去做 optimistic update
        AppDispatcher.handleViewAction({

            // type 是為了方便將來所有 Store 內部判斷是否要處理這個 action
            actionType: AppConstants.TODO_CREATE,

            // 這裏是真正要傳出去的值
            item: item,
        });

        // 2. 回存 server → 這裏要處理 success 與 error 結果的善後

        // POST
        fetch( url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        })

        //.then(status)
        .then(function(res){

    		// 如果新增資料的操作失敗，就要進行 rollback，
    		// 手法是將 tid 傳入 store，它內部刪掉 item 後廣播 change 事件重繪畫面
        	if( res.status !== 200 ){
        		res.json().then(function(data){
	        		AppDispatcher.handleServerAction({
	        		    actionType: AppConstants.OBJECT_SERVER_ERROR,
	        		    tid: data.tid
	        		});
        		})
        		return;
        	}

        	// server 操作成功後會返還正式的 obj.uid，要傳入 store 去更新相應的 instance
        	res.json().then(function(data){

	        	console.log( 'data: ', data );

	        	AppDispatcher.handleServerAction({
	        	    actionType: AppConstants.OBJECT_SERVER_RESULT,
	        	    item: data
	        	});
	        })
        })
        .catch(function(err){
        	console.log( 'ajax error: ', err );
        })
    },

    /**
     * @todo : 將資料存回 server
     */
    removeTodo: function( item ) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_REMOVE,
            item: item
        });

    },

    /**
     * @todo : 將資料存回 server
     */
    updateTodo: function( item, newVal ) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_UPDATE,
            item: item,
            newVal: newVal
        });

    },

    /**
     *
     */
    selectTodo: function( item ) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_SELECT,
            item: item
        });

    },

    /**
     *
     */
    doSearch: function( val ) {

        AppDispatcher.handleViewAction({
            actionType: AppConstants.TODO_FILTER,
            val: val
        });

    },

    // dummy
    noop: function(){}
};

// 讓 fetch 模仿 jquery 行為，遇到 status != 200 時就拋錯，由 .catch() 接手處理
// 但正常的做法應該是直接看 res.status 來處理就好
// 這裏僅為留存參考，沒打算用
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}
module.exports = AppActionCreators;
