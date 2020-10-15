<template>
    <article class="w-auto inline-block mx-2">
        <h1 class="text-6xl text-center">{{ time }}</h1>
        <h3 class="text-xl text-center">{{ date }}</h3>
    </article>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from "vue";

export default defineComponent({
		setup() {
				const date = ref();
				const time = ref();
				const interval = ref();

        const getTimeAndDate = () => {
            const d = new Date();
            const dateOptions = {
                year: "numeric",
                month: "short",
                day: "numeric",
            };

            const timeOptions = {
                hour: "numeric",
                minute: "numeric",
            };

            date.value = new Intl.DateTimeFormat("en-GB", dateOptions).format(d);
            time.value = new Intl.DateTimeFormat("en-GB", timeOptions).format(d);
        };

				onUnmounted(() => {
						clearInterval(interval.value);	
				});

				getTimeAndDate();
				interval.value = setInterval(getTimeAndDate, 5000);

				return {
						date,
						time,
						interval,
						getTimeAndDate
				};
		},
});
</script>
