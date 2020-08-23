<template>
    <div>
        <transition
            leave-active-class="animated bounceOutLeft"
        >
            <button
                v-if="show"
                class="btn"
                id="create"
                @click="
                    show = false
                    action = 'create'
                "
            >Create Game</button>
        </transition>
        <transition
            leave-active-class="animated bounceOutRight"
        >
            <button
                v-if="show"
                class="btn"
                id="join"
                @click="
                    show = false
                    action = 'join'
                "
            >Join Game</button>
        </transition>
        <OnlineForms v-if="!show" ref="onlineforms" :action="action" />
    </div>
</template>

<script>
import OnlineForms from '../forms/OnlineForms.vue'

export default {
    name: 'OnlineOptions',
    components: {
        OnlineForms
    },
    data() {
        return {
            show: false,
            action: ''
        }
    },
    created() {
        this.show = true
    }
}
</script>

<style scoped>
.btn {
    position: absolute;
    top: 100px;
    width: 150px;
    height: 75px;
    border-radius: 4px;
    z-index: 10;
    box-shadow: 0 0 0px 0 rgba(0,0,0,0.3);
    transition: box-shadow 300ms;
}

.btn:not(:focus):hover {
    box-shadow: 0 10px 10px 0 rgba(0,0,0,0.5);
}

.btn:focus {
    outline: none;
}

.btn:hover::after {
    opacity: 1;
}

#create {
    right: 50%;
    transform: translate(-10%);
}

#join {
    left: 50%;
    transform: translate(10%);
}

</style>