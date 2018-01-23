export default function(Vuex) {
  return new Vuex.Store({
    state: {
      sessionID: '',
      userID: -1,
      username: '',
      language: 'en',
      languages: {}
    },
    getters: {
      sessionID: state => state.sessionID,
      userID: state => state.userID,
      username: state => state.username,
      language: state => state.language,
      languages: state => state.languages
    },
    mutations: {
      logout(state) {
        state.sessionID = ""
        state.userID = ""
      },
      setSessionID(state, sessionID) {
        state.sessionID = sessionID
      },
      setUserID(state, userID) {
        state.userID = userID
      },
      setUsername(state, name) {
        state.username = name
      },
      setLanguage(state, language) {
        state.language = language
      },
      loadLanguage(state, {key, data}) {
        state.languages[key] = data
      }
    }
  })
}