<template>
    <div>
        <transition name="fade-left">
            <button 
                v-if="show"
                class="btn"
                id="online"
                @click="
                    show = false
                    mode = 'online'
                    play(mode)
                "
            >Play Online</button>
        </transition>
        <transition name="fade-right">
            <button
                v-if="show"
                class="btn"
                id="ai"
                @click="
                    show = false
                    mode = 'ai'
                    play(mode)
                "
            >Play against AI</button>
        </transition>
    </div>
</template>

<script>
export default({
    data() {
        return {
            show: true,
            mode: ''
        }
    },
    methods: {
        play: function(mode) {
            this.$router.push(`/${mode}`)
        }
    }
})
</script>

<style scoped>
.btn {
    position: absolute;
    top: 100px;
    width: 150px;
    height: 75px;
    border-radius: 4px;
    z-index: 3;
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

#ai {
    left: 50%;
    transform: translate(10%);
}

#online {
    right: 50%;
    transform: translate(-10%);
}

.fade-left-leave-active {
    animation: bounce-left 0.5s ease 1 forwards;
} @keyframes bounce-left {
    0% { right: 50%; }
    50% { right: 49%; }
    100% { right: 100%; }
}

.fade-right-leave-active {
    animation: bounce-right 0.5s ease 1 forwards;
} @keyframes bounce-right {
    0% { left: 50%; }
    50% { left: 49%; }
    100% { left: 100%; }
}

.appear-enter-active {
    animation: appear 1.5s ease 1 forwards;
} @keyframes appear {
    0% { opacity: 0; }
    25% { opacity: 0; }
    50% { opacity: 10; }
    75% { opacity: 50; }
    100% { opacity: 100; }
}

.appear-leave-active {
    animation: disappear 1s ease 1 forwards;
} @keyframes disappear {
    0% { opacity: 100; }
    50% { opacity: 0; }
    100% { opacity: 0; }
}

</style>