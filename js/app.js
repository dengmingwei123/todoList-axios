let vm = new Vue({
	el: "#app",
	data: {
		todosName: "",
		editorId:-1,
		todos: [],
		requestUrl:"http://localhost:3000/todos"
	},
	// 一进入页面执行函数
	mounted() { 
		this.getTodosData();
	},
	methods: {
		getTodosData() { 
			axios.get(this.requestUrl)
				.then(res => { 
					this.todos = res.data;
				})
		},
		// 添加
		addTodos() { 
			// 非空校验
			if (this.todosName.trim() === "") { 
				return;
			}
			
			axios.post(this.requestUrl, {
				name: this.todosName,
				completed:false
			}).then(res => { 
				// 重新获取数据渲染
				this.getTodosData()
				// 添加到数组最后
				// this.todos.push({
				// 	name: this.todosName,
				// 	completed:false
				// })
			})
			// 添加完成后需要将todosName清空
			this.todosName = "";
		},

		// 删除
		removeTodo(index, id) { 
			axios.delete(`${this.requestUrl}/${id}`)
				.then(res => { 
					this.todos.splice(index, 1);
				})
		},

		// 删除已完成的所有
		removeTodos() { 
			// 找到未完成的,赋值给到数据中
			this.todos=this.todos.filter(item => !item.completed)
		},

		// 编辑
		editorTodo(id) { 
			this.editorId = id;
		},
		
		// 编辑确认
		editorTodoEnter(id,data) { 
			axios.patch(`${this.requestUrl}/${id}`, {
				name:data
			})
				.then(res => {
					this.editorId = -1;
				})
		}
	},
	computed: {
		// 判断footer的显示隐藏
		isFooterShow() { 
			return this.todos.length > 0;
		},
		// 判断几个未完成的
		isCompleted() { 
			return this.todos.filter(item => !item.completed).length;
		},
		// 判断全删按钮是否显示
		isClearCompletedShow() { 
			// 只要有一个为true,那么就不用找了,直接返回true
			return this.todos.some(item => item.completed);
		}
	}
})