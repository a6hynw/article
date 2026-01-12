import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer


# Download required NLTK resources (run once)
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('omw-1.4')


class TextPreprocessor:
    def __init__(self):
        """Initialize the text preprocessor"""
        print("Initializing Text Preprocessor...")
        
        # Load stopwords
        self.stop_words = set(stopwords.words('english'))
        
        # Initialize lemmatizer
        self.lemmatizer = WordNetLemmatizer()
        
        print("✅ Text Preprocessor ready!")
    
    def clean_text(self, text):
        """
        Step 1: Basic text cleaning
        """
        # Handle missing or non-string values
        if not isinstance(text, str):
            return ""
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove HTML tags
        text = re.sub(r'<.*?>', '', text)
        
        # Remove numbers
        text = re.sub(r'\d+', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def remove_punctuation(self, text):
        """
        Step 2: Remove punctuation
        """
        return text.translate(str.maketrans('', '', string.punctuation))
    
    def tokenize(self, text):
        """
        Step 3: Tokenize text
        """
        return word_tokenize(text)
    
    def remove_stopwords(self, tokens):
        """
        Step 4: Remove stopwords
        """
        return [
            word for word in tokens
            if word not in self.stop_words and len(word) > 2
        ]
    
    def lemmatize(self, tokens):
        """
        Step 5: Lemmatization
        """
        return [self.lemmatizer.lemmatize(word) for word in tokens]
    
    def preprocess(self, text):
        """
        Complete preprocessing pipeline
        """
        text = self.clean_text(text)
        text = self.remove_punctuation(text)
        tokens = self.tokenize(text)
        tokens = self.remove_stopwords(tokens)
        tokens = self.lemmatize(tokens)
        
        return ' '.join(tokens)


# Test the preprocessor
if __name__ == "__main__":
    preprocessor = TextPreprocessor()
    
    sample_text = """
    Machine Learning is amazing! It's revolutionizing the world.
    Check out https://example.com for more info.
    Email: test@example.com
    """
    
    print("\nOriginal Text:")
    print(sample_text)
    
    print("\nProcessed Text:")
    processed = preprocessor.preprocess(sample_text)
    print(processed)
