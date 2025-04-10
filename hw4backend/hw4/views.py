from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from safetensors.torch import load_file
import typing as tp
import subprocess
import csv

import arxiv
import itertools

import transformers as tr
from transformers import AutoModel
t = tr.RobertaTokenizer.from_pretrained("roberta-base")

pt = "./roberta-classification/checkpoint-9450/model.safetensors"
weights = load_file(pt)

m = tr.RobertaForSequenceClassification.from_pretrained("roberta-base", num_labels=126)
m.load_state_dict(weights)

input_file = csv.DictReader(open("./hw4/v2t.csv"))
v2c = {}
for r in input_file:
	for v,c in r.items():
		v2c[int(v)] = c

client = arxiv.Client()

def arxiv_search(q: str, max_results: int=3) -> itertools.islice:
	"""
	Search for papers on arXiv based on a query string.

	Args:
			q (str): The search query string (e.g., keywords or phrases).
			max_results (int, optional): The maximum number of results to return. Defaults to 3.

	Returns:
			itertools.islice: An iterator over the search results containing arXiv papers.
	"""
	return client.results(arxiv.Search(
		query = q,
		max_results = max_results,
		sort_by = arxiv.SortCriterion.Relevance
	))

def get_fields(r: arxiv.Result) -> tp.Tuple[str,str,str]:
	aus = [str(au) for au in r.authors]
	return [r.title, ','.join(aus), r.summary]

def make_prompt(t: tp.Tuple[str,str,str]) -> str:
	"""
	Generate a formatted prompt string from an arXiv result.

	Args:
			t=[title,authors,summary]

	Returns:
			str: A formatted string containing the title, authors, and summary of the paper.
						Format: "title|author1,author2,...|summary"
	"""
	return (
		t[0]
		+ '|'
		+ t[1]
		+ '|' + t[2]
	)

def home(request):
  return HttpResponse("Hello, Django!")

@ensure_csrf_cookie
@require_http_methods(["POST"])
def get_article(request):
	q: str = request.POST["q"]
	rs = arxiv_search(q, max_results=10)
	# res: str = ""
	articles = []
	prompts = []
	classes = []
	try:
		for r in rs:
			r = next(rs)
			res = get_fields(r)
			articles.append(res)
			p: str = make_prompt(res)
			prompts.append(p)
		
		print(f"promps are ready: {len(prompts)}")

		sample = [x for x in prompts]
		test_ins = [t(x, return_tensors="pt") for x in sample]
		# print(f"ti:{test_ins}")
		classes_ids = [int(m(**ii).logits.argmax(-1)) for ii in test_ins]
		classes = [v2c[x] for x in classes_ids]
	except:
		res = 'unforetunately arxiv api can\'t find such article :('
		print(res)

	return JsonResponse({
			"ok": True,
			"articles": articles,
			'classes': classes,
	})