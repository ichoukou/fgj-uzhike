
import { $wuxBackdrop } from '../index';

Component({
  properties: {
    title: {
      type: String,
      value: '标题'
    }
  },

  data: {
  },

  ready: function () {
    console.log('ready')
  },

  methods: {
  },

  created() {
    console.log('created')
  },
});