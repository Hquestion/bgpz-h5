export default {
    methods: {
        emit(componentName, eventName, ...data){
            let parent = this.$parent;
            let name = parent.$options.componentName;
            while(parent && (!name || name !== componentName)) {
                parent = parent.$parent;
                name = parent && parent.$options.componentName;
            }
            if(parent) {
                parent.$emit.apply(parent, [eventName].concat(data));
            }
        }
    }
};
