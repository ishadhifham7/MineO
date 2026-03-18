import re

with open('client/app/tabs/journey.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_header = r'''        <View style=\{styles\.header\}>
\s*<View style=\{styles\.headerTitleRow\}>
\s*<Ionicons
\s*name="map"
\s*size=\{28\}
\s*color="#B5A993"
\s*style=\{styles\.headerIcon\}
\s*\/\>
\s*<Text style=\{styles\.headerTitle\}>Journey Map<\/Text>
\s*<\/View>
\s*<Text style=\{styles\.headerSubtitle\}>Every step tells a story<\/Text>
\s*<\/View>'''

new_header = r'''        <LinearGradient
          colors={['#2E2A26', '#6B645C', '#B5A993']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTitleRow}>
            <Ionicons
              name="map"
              size={28}
              color="#F6F1E7"
              style={styles.headerIcon}
            />
            <Text style={styles.headerTitle}>Journey Map</Text>
          </View>
          <Text style={styles.headerSubtitle}>Every step tells a story</Text>
        </LinearGradient>'''

text = re.sub(old_header, new_header.replace('\\', '\\\\'), text)

# Ensure the styles match
text = text.replace('''  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 48,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 2,
    borderBottomColor: "#B5A993",
    shadowColor: "#B5A993",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },''', '''  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 10,
  },''')

text = text.replace('''  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#2E2A26",
    letterSpacing: -0.5,
  },''', '''  headerTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#F6F1E7",
    letterSpacing: -0.5,
  },''')

text = text.replace('''  headerSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#B5A993",
    marginTop: 6,
    fontStyle: "italic",
  },''', '''  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(246, 241, 231, 0.8)",
    marginTop: 8,
    letterSpacing: 0.5,
  },''')

with open('client/app/tabs/journey.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated journey completely")
